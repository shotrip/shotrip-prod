import boto3
import time
import os
from datetime import datetime
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from botocore.config import Config
from mangum import Mangum

ssm = boto3.client('ssm', region_name='ap-northeast-1')

_ssm_cache = {}

def get_ssm_param(name, decrypt=False):
    ttl = int(os.environ.get('SSM_PARAMETER_STORE_TTL', 300))
    now = time.time()

    if name in _ssm_cache:
        val, expiry = _ssm_cache[name]
        if now < expiry:
            return val

    res = ssm.get_parameter(Name=name, WithDecryption=decrypt)
    value = res['Parameter']['Value']

    _ssm_cache[name] = (value, now + ttl)
    return value

TABLE_NAME = get_ssm_param("/prod/DYNAMODB_TABLE_NAME")
S3_BUCKET_NAME = get_ssm_param("/prod/S3_BUCKET_NAME")

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(TABLE_NAME)

s3_client = boto3.client(
    "s3",
    region_name="ap-northeast-1",
    config=Config(signature_version="s3v4", s3={'addressing_style': 'virtual'})
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://www.shotrip.jp"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class FavRequest(BaseModel):
    spot_id: str
    is_fav: bool

def get_user_id(raw_request: Request):
    event = raw_request.scope.get("aws.event", {})
    claims = event.get("requestContext", {}).get("authorizer", {}).get("claims", {})
    return claims.get("sub", "GUEST")

def generate_url(s3_key):
    if not s3_key: return None
    return s3_client.generate_presigned_url(
        "get_object",
        Params={"Bucket": S3_BUCKET_NAME, "Key": s3_key},
        ExpiresIn=3600 
    )

@app.put("/spot/fav")
async def toggle_favorite(request_data: FavRequest, raw_request: Request):
    user_id = get_user_id(raw_request)
    pk = f"USER#{user_id}"
    sk = f"FAVORITE#SPOT#{request_data.spot_id}"

    try:
        if request_data.is_fav:
            table.put_item(Item={
                "PK": pk,
                "SK": sk,
                "spot_id": request_data.spot_id,
                "created_at": datetime.utcnow().isoformat(),
                "type": "FAVORITE"
            })
            return {"status": "ok", "action": "added"}
        else:
            table.delete_item(Key={"PK": pk, "SK": sk})
            return {"status": "ok", "action": "removed"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/spot/fav")
async def get_favorites(raw_request: Request):
    user_id = get_user_id(raw_request)
    
    try:
        fav_res = table.query(
            KeyConditionExpression=boto3.dynamodb.conditions.Key("PK").eq(f"USER#{user_id}") & 
                                   boto3.dynamodb.conditions.Key("SK").begins_with("FAVORITE#SPOT#")
        )
        fav_items = fav_res.get("Items", [])
        if not fav_items:
            return {"favorites": []}

        full_spots = []
        for fav in fav_items:
            spot_id = fav["spot_id"]
            master_res = table.get_item(Key={"PK": f"SPOT#{spot_id}", "SK": "PROFILE"})
            master = master_res.get("Item")
            
            if master:
                master["image_url"] = generate_url(master.get("s3_key"))
                full_spots.append(master)
                print(f"Debug: {full_spots}")
        
        return {"favorites": full_spots}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

mangum_handler = Mangum(app, lifespan="off")

def handler(event, context):
    return mangum_handler(event, context)