import boto3
import os

def get_db_token():
    db_host = os.environ.get("DB_HOST")
    db_port = os.environ.get("DB_PORT", "5432")
    db_user = os.environ.get("DB_USER")
    region = os.environ.get("AWS_REGION", "ap-northeast-1")

    client = boto3.client("rds", region_name = region)

    token = client.generate_db_auth_token(
        DBHostname = db_host,
        Port = int(db_port),
        DBUsername = db_user,
        Region = region
    )
    return token