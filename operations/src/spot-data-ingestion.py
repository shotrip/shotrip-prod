import json
import os
import boto3
import time
from datetime import datetime
from openai import OpenAI
from pinecone import Pinecone

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

OPENAI_API_KEY = get_ssm_param("/prod/OPENAI_API_KEY", decrypt=True)
PINECONE_API_KEY = get_ssm_param("/prod/PINECONE_API_KEY", decrypt=True)
PINECONE_INDEX_NAME = get_ssm_param("/prod/PINECONE_INDEX_NAME")
DYNAMODB_TABLE_NAME = get_ssm_param("/prod/DYNAMODB_TABLE_NAME")

pc = Pinecone(api_key=PINECONE_API_KEY)
index = pc.Index(PINECONE_INDEX_NAME)
openai_client = OpenAI(api_key=OPENAI_API_KEY)
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(DYNAMODB_TABLE_NAME)

def lambda_handler(event, context):
    batch_item_failures = []

    for record in event["Records"]:
        message_id = record["messageId"]
        try:
            body = json.loads(record["body"])
            row = json.loads(body['Message']) if 'Message' in body else body

            print(f"Start processing ID: {row.get('ID')}")

            embedding_res = openai_client.embeddings.create(
                model="text-embedding-3-small",
                input=row["content"]
            )
            vector = embedding_res.data[0].embedding
            print("Embedding generated successfully")

            index.upsert(
                vectors=[
                    {
                        "id": row['ID'],
                        "values": vector,
                        "metadata": {
                            "category": row['pc_category'],
                            "city": row['pc_city'],
                            "content": row['content'],
                            "language": row['language'],
                            "name": row['pc_name'],
                            "region": row['pc_region'],
                            "prefecture": row['pc_prefecture'],
                            "spot_id": row['spot_id'],
                            "summary": row['summary']
                        }
                    }
                ],
                namespace="shotrip-general",
            )

            item = {
                'PK': row['PK'],
                'SK': row['SK'],
                'category': row['db_category'],
                'city': row['db_city'],
                'map_url': row['map_url'],
                'name': row['db_name'],
                'region': row['db_region'],
                'prefecture': row['db_prefecture'],
                's3_key': row['s3_key'],
                'spot_desc': row['spot_desc'],
                'updated_at': datetime.now().isoformat()
            }
            table.put_item(Item=item)
            print(f"DynamoDB item put: {row['PK']}")

            print(f"Successfully processed ID: {row['ID']}")
        
        except Exception as e:
            print(f"Error processing record {message_id}: {str(e)}")
            batch_item_failures.append({"itemIdentifier": message_id})

    return {"batchItemFailures": batch_item_failures}