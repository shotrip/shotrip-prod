from fastapi import FastAPI, Depends, HTTPException, Header, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, select
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.ext.declarative import declarative_base
from pydantic import BaseModel
from botocore.config import Config
from botocore.exceptions import ClientError
from jose import jwt
import os
import boto3
from typing import Annotated, List, Optional
from datetime import datetime, timezone
from app.db_utils import get_db_token
from app.models import Route, RouteCheckPoint, UserStampRoute, RouteStatus, UserCheckPoint, RouteReward, User

app = FastAPI(root_path="/stamp")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://www.shotrip.jp"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_HOST = os.environ.get("DB_HOST")
DB_PORT = os.environ.get("DB_PORT", "5432")
DB_USER = os.environ.get("DB_USER")
DB_NAME = os.environ.get("DB_NAME")

Base = declarative_base()
engine = create_engine(
    f"postgresql+psycopg2://{DB_USER}:%s@{DB_HOST}:{DB_PORT}/{DB_NAME}",
    connect_args={"sslmode": "verify-full"},
    pool_size=5,
    max_overflow=10
)

def get_db_url():
    user = os.environ["DB_USER"]
    host = os.environ["DB_HOST"]
    port = os.environ["DB_PORT"]
    db_name = os.environ["DB_NAME"]
    return f"postgresql+psycopg2://{user}:@{host}:{port}/{db_name}"

def get_engine():
    token = get_db_token()
    ssl_root_cert = os.environ.get("SSLROOTCERT")
    return create_engine(
        get_db_url(),
        connect_args={
            "sslmode": "verify-full",
            "sslrootcert": ssl_root_cert,
            "password": token
        }
    )

def get_db():
    engine = get_engine()
    SessionLocal = sessionmaker(bind=engine)
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        engine.dispose()


def get_s3_predigned_url(s3_key: str):
    s3_client = boto3.client(
        "s3",
        region_name="ap-northeast-1",
        config=Config(signature_version="s3v4", s3={"addressing_style": "virtual"}),
    )
    bucket_name = os.environ.get("BUCKET_NAME")
    try:
        url = s3_client.generate_presigned_url(
            "get_object",
            Params={"Bucket": bucket_name, "Key": s3_key},
            ExpiresIn=3600
        )
    except ClientError as e:
        print(f"Failed to genrate URL for {s3_key}.")
        raise e
    
    return url

def verify_token(authorization: Annotated[str | None, Header()] = None):
    if not authorization or not authorization.startswith("Bearer"):
        raise HTTPException(status_code=401, detail="Invalid token")
    token = authorization.replace("Bearer ", "").strip()

    try:
        payload = jwt.get_unverified_claims(token)
        return payload
    except Exception as e:
        print(f"Token decode error: {e}")
        raise HTTPException(status_code=401, detail="Token decode failed")

def get_user_id(payload: dict = Depends(verify_token)):
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="User ID (sub) not found in token")
    return user_id


class RouteResponse(BaseModel):
    id: int
    label: str
    description: str
    key: str
    region: str
    thumbnail_url: str
    status: str

@app.get("/routes", response_model=list[RouteResponse], status_code=status.HTTP_200_OK)
def get_routes(
    db: Session = Depends(get_db),
    user_id: str = Depends(get_user_id)
):
    
    routes = db.query(Route).filter(Route.is_active == True).order_by(Route.route_id.asc()).all()

    user_routes = db.query(UserStampRoute).filter(UserStampRoute.user_id == user_id).all()
    status_map = {ur.route_id: ur.status.value for ur in user_routes}

    return [
        RouteResponse(
            id=r.route_id,
            label=r.name,
            description=r.description,
            key=r.s3_key.replace("routes/", "").replace(".jpg", ""),
            region=r.region,
            thumbnail_url=get_s3_predigned_url(r.s3_key),
            status=status_map.get(r.route_id, "not-started")
        ) for r in routes
    ]

class CheckpointResponse(BaseModel):
    id: str
    name: str
    excerpt: str
    thumbnail_url: str
    stamp_url: str
    order: int
    lat: float
    lng: float
    is_goal: bool

class RouteProgressResponse(BaseModel):
    is_started: bool
    status: str
    stamped_ids: List[str]
    checkpoints: List[CheckpointResponse]

@app.get("/routes/{route_key}/checkpoints", response_model=RouteProgressResponse, status_code=status.HTTP_200_OK)
def get_checkpoints(
    route_key: str,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_user_id)
):
    
    def get_clean_id(s3_key: str) -> str:
        filename = s3_key.split("/")[-1]
        return filename[:-4] if filename.endswith(".jpg") else filename
    
    base_key = route_key.replace(".jpg", "")
    search_key = f"routes/{base_key}.jpg"
    route = db.query(Route).filter(Route.s3_key == search_key).first()

    if not route:
        raise HTTPException(status_code=404, detail=f"Route not found for key: {search_key}")
    
    user_route = db.query(UserStampRoute).filter(
        UserStampRoute.user_id == user_id,
        UserStampRoute.route_id == route.route_id
    ).first()

    stamped_ids = []
    if user_route:
        checkins = db.query(UserCheckPoint).filter(UserCheckPoint.user_route_id == user_route.user_route_id).all()
        for c in checkins:
            cp_record = db.query(RouteCheckPoint).filter(RouteCheckPoint.checkpoint_id == c.checkpoint_id).first()
            if cp_record:
                stamped_ids.append(get_clean_id(cp_record.s3_key))

    checkpoints = db.query(RouteCheckPoint)\
        .filter(RouteCheckPoint.route_id == route.route_id)\
        .order_by(RouteCheckPoint.order_no)\
        .all()
    
    return {
        "is_started": user_route is not None,
        "status": user_route.status.value if user_route else "not-started",
        "stamped_ids": stamped_ids,
        "checkpoints": [
            CheckpointResponse(
                id=get_clean_id(cp.s3_key),
                name=cp.name,
                excerpt=cp.description,
                thumbnail_url=get_s3_predigned_url(cp.s3_key),
                stamp_url=get_s3_predigned_url(cp.stamp_s3_key), ##
                order=cp.order_no,
                lat=float(cp.lat),
                lng=float(cp.lng),
                is_goal=cp.is_goal
            ) for cp in checkpoints
        ]
    }

@app.post("/routes/{route_key}/start", status_code=status.HTTP_201_CREATED)
def start_route(
    route_key: str,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_user_id)
):
    try:
        route = db.query(Route).filter(Route.s3_key.contains(route_key)).first()
        if not route:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="Route Not found"
            )

        existing_status = db.query(UserStampRoute).filter(
            UserStampRoute.user_id == user_id,
            UserStampRoute.route_id == route.route_id
        ).first()

        if existing_status:
            return {"status": existing_status.status.value, "message": "Already Started"}

        new_start = UserStampRoute(
            user_id=user_id,
            route_id=route.route_id,
            status=RouteStatus.IN_PROGRESS.value,
            started_at=datetime.now(timezone.utc)
        )
        
        db.add(new_start)
        db.commit()
        db.refresh(new_start)
        
        return {"status": new_start.status.value, "message": "Started!"}

    except Exception as e:
        db.rollback()
        print(f"Error starting route: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error occured in start process"
        )


class CheckInRequest(BaseModel):
    checkpoint_id: str
class RewardResponse(BaseModel):
    affiliate_url: str
    description: str
class CheckInResponse(BaseModel):
    message: str
    is_completed: bool
    status: str
    stamped_ids: List[str]
    current_stamp_url: Optional[str] = None
    reward: Optional[RewardResponse] = None

@app.post("/routes/{route_key}/check-in", response_model=CheckInResponse)
def check_in(
    route_key: str,
    request: CheckInRequest,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_user_id)
):
    try:
        route = db.query(Route).filter(Route.s3_key.contains(route_key)).first()
        if not route:
            raise HTTPException(status_code=404, detail="Route not found")
        
        target_cp = db.query(RouteCheckPoint).filter(
            RouteCheckPoint.route_id == route.route_id,
            RouteCheckPoint.s3_key.contains(request.checkpoint_id)
        ).first()

        if not target_cp:
            raise HTTPException(status_code=404, detail="Checkpoint not found")

        user_route = db.query(UserStampRoute).filter(
            UserStampRoute.user_id == user_id,
            UserStampRoute.route_id == route.route_id,
            UserStampRoute.status == RouteStatus.IN_PROGRESS.value
        ).first()

        if not user_route:
            raise HTTPException(status_code=400, detail="Route is not in progress")

        new_checkin = UserCheckPoint(
            user_route_id=user_route.user_route_id,
            checkpoint_id=target_cp.checkpoint_id
        )
        db.add(new_checkin)
        db.flush()

        stamped_ids = []
        for c in db.query(UserCheckPoint).filter(UserCheckPoint.user_route_id == user_route.user_route_id).all():
            cp_record = db.query(RouteCheckPoint).filter(RouteCheckPoint.checkpoint_id == c.checkpoint_id).first()
            if cp_record:
                frontend_id = cp_record.s3_key.split('/')[-1].replace('.jpg', '')
                stamped_ids.append(frontend_id)


        total_checkpoints = db.query(RouteCheckPoint).filter(
            RouteCheckPoint.route_id == route.route_id
        ).count()
        is_completed = len(stamped_ids) >= total_checkpoints

        reward_data = None
        if is_completed:
            user_route.status = RouteStatus.COMPLETED.value
            user_route.completed_at = datetime.now(timezone.utc)

            reward = db.query(RouteReward).filter(RouteReward.route_id == route.route_id).first()
            if reward:
                reward_data = RewardResponse(
                    affiliate_url=reward.affiliate_url,
                    description=reward.description
                )

        db.commit()

        current_url = get_s3_predigned_url(target_cp.stamp_s3_key)
        
        return CheckInResponse(
            message="Checked in successfully",
            is_completed=is_completed,
            status=user_route.status.value,
            stamped_ids=stamped_ids,
            current_stamp_url=current_url,
            reward=reward_data
        )

    except Exception as e:
        db.rollback()
        if "unique_user_checkpoint" in str(e):
             raise HTTPException(status_code=409, detail="Already checked in")
        raise HTTPException(status_code=500, detail="Internal server error")
    

@app.delete("/user/delete", status_code=status.HTTP_204_NO_CONTENT)
def delete_user_data(
    db: Session = Depends(get_db),
    user_id: str = Depends(get_user_id)
):
    try:
        user_routes = db.query(UserStampRoute).filter(UserStampRoute.user_id == user_id).all()
        user_route_ids = [ur.user_route_id for ur in user_routes]
        
        if user_route_ids:
            db.query(UserCheckPoint).filter(UserCheckPoint.user_route_id.in_(user_route_ids)).delete(synchronize_session=False)
        
        db.query(UserStampRoute).filter(UserStampRoute.user_id == user_id).delete(synchronize_session=False)
        
        db.query(User).filter(User.user_id == user_id).delete(synchronize_session=False)
        
        db.commit()
        return None

    except Exception as e:
        db.rollback()
        print(f"Error deleting user data: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete user records"
        )


@app.get("/health")
def health_check():
    return {"status": "OK"}