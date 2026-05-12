import os
import time
import stripe
from stripe import SignatureVerificationError
from datetime import datetime, timezone, timedelta
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum
import boto3
from botocore.exceptions import ClientError
from decimal import Decimal
from jose import jwt

app = FastAPI()
ssm = boto3.client("ssm", region_name="ap-northeast-1")


_ssm_cache = {}
def get_config(name, decrypt=False):
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


stripe.api_key = get_config("/prod/STRIPE_SECRET_KEY", decrypt=True)
endpoint_secret = get_config("/prod/STRIPE_WEBHOOK_SECRET", decrypt=True)
table_name = get_config("/prod/DYNAMODB_TABLE_NAME")
base_success_url = get_config("/prod/PAYMENT_SUCCESS_URL")
base_cancel_url = get_config("/prod/PAYMENT_CANCEL_URL")

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(table_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://www.shotrip.jp"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/prepare")
async def prepare_payment(request: Request):
    try:

        auth_header = request.headers.get("Authorization")
        user_email = None

        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
            claims = jwt.get_unverified_claims(token)
            user_email = claims.get("email")

        data = await request.json()
        user_id = data.get("user_id")
        product_code = data.get("product_code")
        order_id = data.get("order_id")

        if not all([user_id, product_code, order_id]):
            raise HTTPException(status_code=400, detail="Missing parameters")

        PAYMENT_CONFIG = {
            "tokens_30": {
                "stripe_price": get_config("/prod/STRIPE_PRICE_TOKENS_30"),
                "amount": "3.00",
                "tokens": 30,
                "type": "token_pack",
            },
            "tokens_100": {
                "stripe_price": get_config("/prod/STRIPE_PRICE_TOKENS_100"),
                "amount": "6.00",
                "tokens": 100,
                "type": "token_pack",
            },
            "unlimited_month": {
                "stripe_price": get_config("/prod/STRIPE_PRICE_UNLIMITED_MONTH"),
                "amount": "7.00",
                "tokens": None,
                "type": "unlimited_month",
            },
        }
        config = PAYMENT_CONFIG.get(product_code)
        if not config:
            raise HTTPException(
                status_code=400, detail=f"Invalid product code: {product_code}"
            )

        if not base_success_url or not base_cancel_url:
            return JSONResponse(
                status_code=500,
                content={
                    "error": "Environment variable PAYMENT_SUCCESS_URL or PAYMENT_CANCEL_URL is missing"
                },
            )

        session = stripe.checkout.Session.create(
            line_items=[
                {
                    "price": config["stripe_price"],
                    "quantity": 1,
                }
            ],
            mode="payment",
            client_reference_id=user_id,
            customer_email=user_email,
            metadata={
                "product_code": product_code,
                "order_id": order_id,
                "user_id": user_id,
            },
            payment_intent_data={
                "receipt_email": user_email,
                "metadata": {
                    "product_code": product_code,
                    "order_id": order_id,
                    "user_id": user_id,
                },
            },
            success_url=base_success_url,
            cancel_url=base_cancel_url,
            idempotency_key=order_id,
        )

        now = datetime.now(timezone.utc).isoformat()

        product_type = (
            "unlimited_month" if product_code == "unlimited_month" else "token_pack"
        )
        token_amount = (
            30
            if product_code == "tokens_30"
            else 100 if product_code == "tokens_100" else None
        )
        amount_value = Decimal(config["amount"])

        try:
            table.put_item(
                Item={
                    "PK": f"USER#{user_id}",
                    "SK": f"PAYMENT#{order_id}",
                    "payment_id": session.id,
                    "provider": "stripe_unified",
                    "status": "pending",
                    "product_code": product_code,
                    "product_type": product_type,
                    "token_amount": token_amount,
                    "amount": amount_value,
                    "currency": "USD",
                    "created_at": now,
                    "updated_at": now,
                },
                ConditionExpression="attribute_not_exists(SK)",
            )
        except ClientError as e:
            if e.response["Error"]["Code"] == "ConditionalCheckFailedException":
                print(f"Duplicate prepare request: {order_id}")
            else:
                raise e

        return {"checkoutUrl": session.url}

    except Exception as e:
        import traceback

        print(traceback.format_exc())
        return JSONResponse(status_code=500, content={"error": str(e)})


@app.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)
    except (ValueError, SignatureVerificationError) as e:
        raise HTTPException(status_code=400, detail="Invalid signature")

    event_type = event["type"]
    data_obj = event["data"]["object"]

    metadata = data_obj.get("metadata", {})
    order_id = metadata.get("order_id")
    user_id = data_obj.get("client_reference_id") or metadata.get("user_id")

    print(f"Received event: {event['type']}, OrderID: {order_id}, UserID: {user_id}")

    if not (user_id and order_id):
        return {"status": "ignored"}

    target_sk = f"PAYMENT#{order_id}"

    if event_type == "checkout.session.completed":
        tx_id = data_obj.get("payment_intent")
        if update_status(user_id, target_sk, "succeeded", tx_id):
            apply_usage(user_id, target_sk)

    elif event_type == "payment_intent.payment_failed":
        tx_id = data_obj.get("id")
        update_status(user_id, target_sk, "failed", tx_id)

    elif event_type == "checkout.session.expired":
        tx_id = data_obj.get("payment_intent") or data_obj.get("id")
        update_status(user_id, target_sk, "failed", tx_id)

    return {"status": "success"}


def update_status(user_id: str, sk: str, status: str, tx_id: str):
    now = datetime.now(timezone.utc).isoformat()

    if status == "succeeded":
        allowed_statuses = ["pending", "failed"]
    else:
        allowed_statuses = ["pending"]

    try:
        table.update_item(
            Key={"PK": f"USER#{user_id}", "SK": sk},
            UpdateExpression="SET #s = :s, provider_tx_id = :tx, updated_at = :now",
            ConditionExpression="attribute_exists(PK) AND #s IN (:s1, :s2)",
            ExpressionAttributeNames={"#s": "status"},
            ExpressionAttributeValues={
                ":s": status,
                ":tx": tx_id if tx_id else "N/A",
                ":now": now,
                ":s1": allowed_statuses[0],
                ":s2": (
                    allowed_statuses[1]
                    if len(allowed_statuses) > 1
                    else allowed_statuses[0]
                ),
            },
        )
        return True
    except ClientError as e:
        if e.response["Error"]["Code"] == "ConditionalCheckFailedException":
            print(f"Update skipped for {sk}: Status is already finalized.")
            return False
        raise e


def apply_usage(user_id: str, sk: str):
    now = datetime.now(timezone.utc).isoformat()
    try:
        res = table.get_item(Key={"PK": f"USER#{user_id}", "SK": sk})
        item = res.get("Item")
        if not item:
            return

        usage_pk = f"USER#{user_id}"
        usage_sk = "USAGE#ACCOUNT"

        if item.get("product_type") == "token_pack":
            table.update_item(
                Key={"PK": usage_pk, "SK": usage_sk},
                UpdateExpression="ADD paid_balance :amt SET updated_at = :now",
                ExpressionAttributeValues={
                    ":amt": item.get("token_amount"),
                    ":now": now,
                },
            )
        elif item.get("product_type") == "unlimited_month":
            until = (datetime.now(timezone.utc) + timedelta(days=30)).isoformat()
            table.update_item(
                Key={"PK": usage_pk, "SK": usage_sk},
                UpdateExpression="SET unlimited_until = :u, updated_at = :now",
                ExpressionAttributeValues={":u": until, ":now": now},
            )

        table.update_item(
            Key={"PK": f"USER#{user_id}", "SK": sk},
            UpdateExpression="SET usage_applied_at = :now",
            ExpressionAttributeValues={":now": now},
        )
    except Exception as e:
        print(f"Usage application failed: {e}")


handler = Mangum(app)
