from fastapi import FastAPI, HTTPException, status, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum
import boto3
from botocore.config import Config
from botocore.exceptions import ClientError
from datetime import datetime, timezone
import uuid
from typing import List, Literal
from pydantic import BaseModel, Field
from openai import OpenAI
from pinecone import Pinecone
import time
import os

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

DYNAMODB_TABLE_NAME = get_ssm_param("/prod/DYNAMODB_TABLE_NAME")
S3_BUCKET_NAME = get_ssm_param("/prod/S3_BUCKET_NAME")
PINECONE_API_KEY = get_ssm_param("/prod/PINECONE_API_KEY", decrypt=True)
PINECONE_INDEX_NAME = get_ssm_param("/prod/PINECONE_INDEX_NAME")
OPENAI_API_KEY = get_ssm_param("/prod/OPENAI_API_KEY", decrypt=True)

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(DYNAMODB_TABLE_NAME)

s3_client = boto3.client(
    "s3",
    region_name="ap-northeast-1",
    config=Config(signature_version="s3v4", s3={"addressing_style": "virtual"}),
)

pc = Pinecone(api_key=PINECONE_API_KEY)
index = pc.Index(PINECONE_INDEX_NAME)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://www.shotrip.jp"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    print(f"DEBUG: Validation error details: {exc.errors()}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": "Invalid parameters provided.", "code": "VALIDATION_ERROR"},
    )


class LensContext(BaseModel):
    tenantId: Literal["shotrip"] = Field(...)
    namespace: Literal["shotrip-general"] = Field(...)
    token: Literal["shotrip-prod"] = Field(...)


class ChatRequest(BaseModel):
    message: str
    session_id: str = None
    context: LensContext


def get_openai_client():
    import os

    print(f"DEBUG_ENV_KEYS: {list(os.environ.keys())}")

    if not OPENAI_API_KEY:
        raise ValueError("OPENAI_API_KEY is not set in environment variables")
    return OpenAI(api_key=OPENAI_API_KEY)


WEEKLY_FREE_LIMIT = 10


@app.post("/chat")
async def chat_endpoint(user_data: ChatRequest, raw_request: Request):
    ctx = user_data.context
    target_namespace = ctx.namespace
    event = raw_request.scope.get("aws.event", {})
    claims = event.get("requestContext", {}).get("authorizer", {}).get("claims", {})
    user_id = claims.get("sub", "GUEST")

    now_obj = datetime.now(timezone.utc)
    now_str = now_obj.isoformat()
    res = table.get_item(Key={"PK": f"USER#{user_id}", "SK": "USAGE#ACCOUNT"})
    acc_item = res.get("Item", {})

    is_unlimited = False
    unlimited_until_str = acc_item.get("unlimited_until")
    if unlimited_until_str:
        unlimited_until = datetime.fromisoformat(
            unlimited_until_str.replace("Z", "+00:00")
        )
        if now_obj < unlimited_until:
            is_unlimited = True

    free_used = int(acc_item.get("weekly_free_used", 0))
    paid_balance = int(acc_item.get("paid_balance", 0))

    if not is_unlimited:
        if free_used >= WEEKLY_FREE_LIMIT and paid_balance <= 0:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient tokens."
            )

    client = get_openai_client()
    try:
        region_to_prefs = {
            "Hokkaido": ["Hokkaido"],
            "Tohoku": ["Aomori", "Iwate", "Miyagi", "Akita", "Yamagata", "Fukushima"],
            "Kanto": ["Ibaraki", "Tochigi", "Gunma", "Saitama", "Chiba", "Tokyo", "Kanagawa"],
            "Hokuriku": ["Toyama", "Ishikawa", "Fukui", "Nigata"],
            "Chubu": ["Yamanashi", "Nagano", "Gifu", "Shizuoka", "Aichi"],
            "Kinki": ["Mie", "Shiga", "Kyoto", "Osaka", "Hyogo", "Nara", "Wakayama"],
            "Chugoku": ["Tottori", "Shimane", "Okayama", "Hiroshima", "Yamaguchi"],
            "Shikoku": ["Tokushima", "Kagawa", "Ehime", "Kochi"],
            "Kyushu": ["Fukuoka", "Saga", "Nagasaki", "Kumamoto", "Oita", "Miyazaki", "Kagoshima"],
            "Okinawa": ["Okinawa"]
        }

        regions_list = list(region_to_prefs.keys())
        prefectures_list = [
            pref for prefs in region_to_prefs.values() for pref in prefs
        ]

        history_items = get_chat_history(user_id, limit=5)
        past_messages = []
        for item in reversed(history_items):
            past_messages.append(
                {
                    "role": item.get("role", "assistant"),
                    "content": item.get("content", ""),
                    "source_nodes": item.get("source_nodes", []),
                }
            )

        user_msg_lower = user_data.message.lower()

        detected_pref = next((p for p in prefectures_list if p.lower() in user_msg_lower), None)
        detected_region = next((r for r in regions_list if r.lower() in user_msg_lower), None)

        is_asking_more = any(k in user_msg_lower for k in ["others", "more", "else", "another", "anything"])
        is_generic_query = any(k in user_msg_lower for k in ["how", "before", "rule", "tip", "money", "train", "card", "etiquette", "manner", "transportation"])

        last_ai_msg = past_messages[-1] if past_messages and past_messages[-1]["role"] == "assistant" else None

        if not detected_pref and not detected_region:
            if not is_generic_query or is_asking_more:
                if last_ai_msg:
                    detected_pref = next((p for p in prefectures_list if p.lower() in last_ai_msg["content"].lower()), None)
                    if not detected_pref and last_ai_msg.get("source_nodes"):
                        detected_pref = last_ai_msg["source_nodes"][0].get("prefecture")
        
        embed_res = client.embeddings.create(
            input=user_data.message, model="text-embedding-3-small"
        )
        query_vector = embed_res.data[0].embedding
        THRESHOLD = 0.2
        
        filter_dict = {}
        if detected_pref:
            filter_dict["prefecture"] = {"$eq": detected_pref}
        elif detected_region:
            filter_dict["region"] = {"$eq": detected_region}

        res_filtered = index.query(
            vector=query_vector, top_k=10 if is_asking_more else 3,
            include_metadata=True, namespace=target_namespace,
            filter=filter_dict if filter_dict else None
        )
        res_global = index.query(
            vector=query_vector, top_k=5 if is_asking_more else 3,
            include_metadata=True, namespace=target_namespace,
            filter=None
        )

        all_matches = sorted(res_filtered.matches + res_global.matches, key=lambda x: x.score, reverse=True)
        seen_ids = set()
        unique_matches = []
        for m in all_matches:
            if m.id not in seen_ids:
                unique_matches.append(m)
                seen_ids.add(m.id)

        has_strong_global_hit = any(m.metadata.get("region") == "Global" and m.score > 0.35 for m in unique_matches)
        keywords = ["temple", "onsen", "castle", "park", "shrine", "food", "restaurant"]
        target_categories = [k for k in keywords if k in user_msg_lower]

        spot_contexts = []
        other_contexts = []
        source_details_for_ui = []
        source_details_for_db = []

        for match in unique_matches:
            current_score = match.score
            meta = match.metadata
            item_region = meta.get("region", "")
            item_pref = meta.get("prefecture", "")

            if item_region == "Global":
                other_contexts.append(f"Title: {meta.get('name')}\nCategory: {meta.get('category')}\nContent: {meta.get('content')}")
                continue

            if has_strong_global_hit and not detected_pref:
                if current_score < 0.4: continue
            if detected_pref and detected_pref.lower() not in item_pref.lower(): continue
            if detected_region:
                allowed_prefs = region_to_prefs.get(detected_region, [])
                if not (item_region.lower() == detected_region.lower() or item_pref in allowed_prefs): continue

            is_category_match = any(cat in meta.get("category", "").lower() for cat in target_categories)
            if is_category_match: current_score += 0.1
            if current_score < THRESHOLD: continue

            spot_id = match.metadata.get("spot_id")
            db_res = table.get_item(
                Key={
                    "PK": f"SPOT#{spot_id}",
                    "SK": "PROFILE",
                }
            )
            spot_item = db_res.get("Item", {})

            s3_key = spot_item.get("s3_key")
            presigned_url = generate_url(s3_key)

            spot_info = (
                f"Spot: {match.metadata.get('name')}\n"
                f"Region: {match.metadata.get('region')}\n"
                f"Location: {match.metadata.get('city')}, {match.metadata.get('prefecture')}\n"
                f"Description: {match.metadata.get('content')}"
            )
            spot_contexts.append(spot_info)

            source_details_for_ui.append(
                {
                    "spot_id": spot_id,
                    "name": spot_item.get("name", match.metadata.get("name")),
                    "image_url": presigned_url,
                    "short_description": spot_item.get("spot_desc", ""),
                    "prefecture": spot_item.get("prefecture", ""),
                    "city": spot_item.get("city", ""),
                    "map_url": spot_item.get("map_url"),
                }
            )

            source_details_for_db.append(
                {
                    "spot_id": spot_id,
                    "name": spot_item.get("name"),
                    "s3_key": s3_key,
                    "short_description": spot_item.get("spot_desc"),
                    "prefecture": spot_item.get("prefecture", ""),
                    "city": spot_item.get("city"),
                    "map_url": spot_item.get("map_url"),
                }
            )

        context_spots_text = "\n\n".join(spot_contexts)
        context_others_text = "\n\n".join(other_contexts)
        current_area = detected_pref or detected_region or "Unknown"

        spot_status = "STILL_AVAILABLE" if context_spots_text else "EXHAUSTED_OR_NONE"

        current_spot = "None"
        if last_ai_msg and last_ai_msg.get("source_nodes"):
            current_spot = last_ai_msg["source_nodes"][0].get("name", "None")
        allowed_areas_text = "\n".join([f"- {reg}: {', '.join(prefs)}" for reg, prefs in region_to_prefs.items()])

        #(----- Context text -----")
        prompt = f"""
        # Role
        You are "ShotripLens", a concierge that provides concise travel highlights.
        You are a travel assistant for Shotrip.

        # Reference Data: Allowed Areas
        {allowed_areas_text}

        # Current Session Status
        - **Current Target Area**: {current_area}
        - **Current Target Spot**: {current_spot}
        - **Spot Context Status**: {spot_status}

        # Task & Decision Logic
        1. **Analyze All Contexts**:
        - Check # Context: Spots for location-specific attractions.
        - Check # Context: Other for general guides/How-to info.
        
        2. **Response Selection (Exhaustive)**:
        - **Scenario: Spot Available**: If # Context: Spots has data matching the "{current_area}", introduce them.
        - **Scenario: Other Available**: If # Context: Other has relevant info (e.g., IC cards, general rules), provide it independently or alongside spots.
        - **Scenario: Both Available**: Combine them concisely if both relate to the user's intent.
        - **Scenario: Follow-up**: If the user asks about directions (e.g., "how can i get there?", "how should i go?"), identify the destination using "{current_spot}" (as the implied "there"), "{current_area}", and # Context data to explain the route or tips.
        - **Scenario: No Data**: ONLY if both contexts are empty AND "**Current Target Area**" is "Unknown", ask: "Which area or prefecture are you going to visit?"

        # Rules
        - **Independence**: You can answer using ONLY # Context: Other if it satisfies the user's question.
        - **Spot Integrity**: ONLY use spots from # Context: Spots that match the identified area. (Status: {spot_status})
        - **Context Priority**: Always prioritize the "{current_area}" provided above to maintain conversation flow. Never say you don't know the location if Target Area is {current_area}.
        - **Format**: Max 200 words. Bold spot/topic names.

        # Context: Spots
        {context_spots_text if context_spots_text else "None available."}

        # Context: Other (How-to)
        {context_others_text if context_others_text else "None available."}
        """

        messages = [
            {"role": "system", "content": prompt},
            *past_messages,
            {
                "role": "user",
                "content": f"""# Context Data
        [Spot Information]
        {context_spots_text if context_spots_text else "No specific spots found for this area."}

        [Practical Tips & How-to]
        {context_others_text if context_others_text else "No general tips available."}

        # User Question
        {user_data.message}"""
            },
        ]

        response = client.chat.completions.create(
            model="gpt-4o-mini", messages=messages
        )

        answer = response.choices[0].message.content

        session_id = user_data.session_id or str(uuid.uuid4())
        tx_id = f"tx_{str(uuid.uuid4())[:8]}"

        RETENTION_DAYS = 30
        ttl_value = int(time.time()) + (RETENTION_DAYS * 24 * 60 * 60)

        user_timestamp = datetime.utcnow().isoformat()
        table.put_item(
            Item={
                "PK": f"SESSION#{session_id}",
                "SK": f"MESSAGE#{user_timestamp}#USER",
                "GSI1PK": f"USER#{user_id}",
                "GSI1SK": f"MESSAGE#{user_timestamp}",
                "role": "user",
                "content": user_data.message,
                "created_at": user_timestamp,
                "expires_at": ttl_value,
            }
        )

        ai_timestamp = datetime.utcnow().isoformat()
        table.put_item(
            Item={
                "PK": f"SESSION#{session_id}",
                "SK": f"MESSAGE#{ai_timestamp}#AI",
                "GSI1PK": f"USER#{user_id}",
                "GSI1SK": f"MESSAGE#{ai_timestamp}",
                "role": "assistant",
                "content": answer,
                "source_nodes": source_details_for_db,
                "created_at": ai_timestamp,
                "expires_at": ttl_value,
                "is_good": None,
            }
        )

        if not is_unlimited:
            is_free_slot = free_used < WEEKLY_FREE_LIMIT
            expr_values = {":inc": 1, ":now": now_str}
            if is_free_slot:
                expr_values[":limit"] = WEEKLY_FREE_LIMIT

            transact_items = [
                {
                    "Update": {
                        "TableName": "ChatbotTable",
                        "Key": {"PK": f"USER#{user_id}", "SK": "USAGE#ACCOUNT"},
                        "UpdateExpression": (
                            "SET weekly_free_used = weekly_free_used + :inc, updated_at = :now"
                            if is_free_slot
                            else "SET paid_balance = paid_balance - :inc, updated_at = :now"
                        ),
                        "ConditionExpression": (
                            "weekly_free_used < :limit"
                            if is_free_slot
                            else "paid_balance >= :inc"
                        ),
                        "ExpressionAttributeValues": expr_values,
                    }
                },
                {
                    "Put": {
                        "TableName": "ChatbotTable",
                        "Item": {
                            "PK": f"USER#{user_id}",
                            "SK": f"TRANSACTION#{now_str}#{tx_id}",
                            "type": "consume",
                            "amount": -1,
                            "plan_type": "free" if is_free_slot else "paid",
                            "created_at": now_str,
                        },
                    }
                },
            ]
            table.meta.client.transact_write_items(TransactItems=transact_items)

        final_acc_res = table.get_item(
            Key={"PK": f"USER#{user_id}", "SK": "USAGE#ACCOUNT"}
        )
        final_acc = final_acc_res.get("Item", acc_item)
        return {
            "headers": {
                "Access-Control-Allow-Origin": "http://www.shotrip.jp",
                "Access-Control-Allow-Headers": "Content-Type,Authorization",
                "Access-Control-Allow-Methods": "OPTIONS,POST",
            },
            "answer": answer,
            "source": source_details_for_ui,
            "new_tokens": {
                "free": max(
                    0, WEEKLY_FREE_LIMIT - int(final_acc.get("weekly_free_used", 0))
                ),
                "paid": int(final_acc.get("paid_balance", 0)),
                "is_unlimited": is_unlimited,
                "unlimited_until": unlimited_until_str,
            },
        }

    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


@app.get("/history")
async def history_endpoint(raw_request: Request):
    event = raw_request.scope.get("aws.event", {})
    claims = event.get("requestContext", {}).get("authorizer", {}).get("claims", {})
    user_id = claims.get("sub", "GUEST")

    history_items = get_chat_history(user_id, limit=10)

    fav_res = table.query(
        KeyConditionExpression=boto3.dynamodb.conditions.Key("PK").eq(f"USER#{user_id}")
        & boto3.dynamodb.conditions.Key("SK").begins_with("FAVORITE#SPOT#")
    )
    fav_ids = {item["spot_id"] for item in fav_res.get("Items", [])}

    formatted_history: List[dict] = []
    for item in reversed(history_items):
        source_nodes = item.get("source_nodes", [])
        formatted_sources: List[dict] = []

        for s in source_nodes:
            spot_id = s.get("spot_id")
            formatted_sources.append(
                {
                    "spot_id": spot_id,
                    "name": s.get("name"),
                    "image_url": generate_url(s.get("s3_key")),
                    "short_description": s.get("short_description"),
                    "prefecture": s.get("prefecture"),
                    "city": s.get("city"),
                    "map_url": s.get("map_url"),
                    "is_fav": spot_id in fav_ids,
                }
            )

        formatted_history.append(
            {
                "pk": item.get("PK"),
                "id": item.get("SK"),
                "role": item.get("role"),
                "content": item.get("content"),
                "source": formatted_sources,
                "is_good": item.get("is_good"),
            }
        )

    return {"history": formatted_history}


def get_chat_history(user_id: str, limit: int = 10):
    response = table.query(
        IndexName="GSI1",
        KeyConditionExpression=boto3.dynamodb.conditions.Key("GSI1PK").eq(
            f"USER#{user_id}"
        ),
        ScanIndexForward=False,
        Limit=limit,
    )
    return response.get("Items", [])


def generate_url(s3_key):
    if not s3_key:
        return None
    try:
        return s3_client.generate_presigned_url(
            "get_object",
            Params={"Bucket": S3_BUCKET_NAME, "Key": s3_key},
            ExpiresIn=3600,
        )
    except ClientError as e:
        print(f"Failed to genrate URL for {s3_key}.")
        raise e


class LikeRequest(BaseModel):
    pk: str
    sk: str
    is_good: bool


@app.put("/chat/like")
async def update_like_endpoint(data: LikeRequest, raw_request: Request):
    event = raw_request.scope.get("aws.event", {})
    claims = event.get("requestContext", {}).get("authorizer", {}).get("claims", {})
    user_id = claims.get("sub", "GUEST")

    try:
        table.update_item(
            Key={
                "PK": data.pk,
                "SK": data.sk,
            },
            UpdateExpression="SET is_good = :val, updated_at = :now",
            ExpressionAttributeValues={
                ":val": data.is_good,
                ":now": datetime.utcnow().isoformat(),
            },
        )

        return {"status": "ok"}
    except Exception as e:
        return {"error": str(e)}


class UserProfileResponse(BaseModel):
    nickname: str
    nationality: str
    honorific: str
    age: str
    sub: str


@app.get("/user/me", response_model=UserProfileResponse)
async def get_user_profile(raw_request: Request):
    event = raw_request.scope.get("aws.event", {})
    claims = event.get("requestContext", {}).get("authorizer", {}).get("claims", {})

    return {
        "nickname": claims.get("custom:display_name", ""),
        "honorific": claims.get("custom:honorific", ""),
        "nationality": claims.get("custom:nationality", ""),
        "age": claims.get("custom:age", ""),
        "sub": claims.get("sub", ""),
    }


class TokenResponse(BaseModel):
    free: int
    paid: int
    is_unlimited: bool = False
    unlimited_until: str = None


@app.get("/user/tokens", response_model=TokenResponse)
async def get_tokens(raw_request: Request):
    event = raw_request.scope.get("aws.event", {})
    claims = event.get("requestContext", {}).get("authorizer", {}).get("claims", {})
    user_id = claims.get("sub", "GUEST")

    try:
        response = table.get_item(Key={"PK": f"USER#{user_id}", "SK": "USAGE#ACCOUNT"})
        item = response.get("Item", {})

        now = datetime.now(timezone.utc)
        unlimited_until_str = item.get("unlimited_until")
        is_unlimited = False

        if unlimited_until_str:
            unlimited_until = datetime.fromisoformat(
                unlimited_until_str.replace("Z", "+00:00")
            )
            if now < unlimited_until:
                is_unlimited = True

        print(f"DEBUG: is_unlimited={is_unlimited}")

        return {
            "free": max(0, WEEKLY_FREE_LIMIT - int(item.get("weekly_free_used", 0))),
            "paid": int(item.get("paid_balance", 0)),
            "is_unlimited": is_unlimited,
            "unlimited_until": unlimited_until_str,
        }
    except Exception as e:
        print(f"Token Fetch Error: {e}")
        return {"free": 0, "paid": 0, "is_unlimited": False}


@app.get("/health")
def health_check():
    return {"status": "ok"}


mangum_handler = Mangum(app, lifespan="off")


def handler(event, context):
    return mangum_handler(event, context)
