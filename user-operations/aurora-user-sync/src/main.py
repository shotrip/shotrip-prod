import json
import os
import psycopg2
import boto3

_conn = None

def get_db_token():
    db_host = os.environ.get("DB_HOST")
    db_port = os.environ.get("DB_PORT", "5432")
    db_user = os.environ.get("DB_USER")
    region = os.environ.get("A_REGION", "ap-northeast-1")

    client = boto3.client("rds", region_name = region)

    token = client.generate_db_auth_token(
        DBHostname = db_host,
        Port = int(db_port),
        DBUsername = db_user,
        Region = region
    )
    return token

###
def get_db_connection():
    global _conn

    if _conn is None or _conn.closed != 0:
        token = get_db_token()
        _conn = psycopg2.connect(
            host=os.environ.get("DB_HOST"),     
            port=os.environ.get("DB_PORT", "5432"),
            database=os.environ.get("DB_NAME"),
            user=os.environ.get("DB_USER"),
            password=token,
            sslmode=os.environ.get("SSLMODE"),
            sslrootcert=os.environ.get("SSLROOTCERT")
        )
    return _conn

def lambda_handler(event, context):
    print("Function started")
    
    try:
        conn = get_db_connection()
        with conn.cursor() as cur:
            for record in event.get('Records', []):
                body = json.loads(record['body'])
                detail = body.get('detail')
                if isinstance(detail, str):
                    detail = json.loads(detail)
                user_id = detail.get('user_id')
                if user_id:
                    cur.execute(
                        "INSERT INTO users (user_id) VALUES (%s) ON CONFLICT (user_id) DO NOTHING;",
                        (user_id,)
                    )
            conn.commit()
    except Exception as e:
        print(f"Error: {e}")
        _conn = None
        raise e
        
    return {"statusCode": 200, "body": "OK"}