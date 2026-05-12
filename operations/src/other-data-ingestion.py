import json
import os
import boto3
import time
from openai import OpenAI
from pinecone import Pinecone

ssm = boto3.client('ssm', region_name='ap-northeast-1')

#ssm cache creation
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

pc = Pinecone(api_key=PINECONE_API_KEY)
index = pc.Index(PINECONE_INDEX_NAME)
openai_client = OpenAI(api_key=OPENAI_API_KEY)

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
                            "content": row['content'],
                            "category": row['category'],
                            "language": row['language'],
                            "name": row['name'],
                            "region": row['region'],
                            "summary": row['summary']
                        }
                    }
                ],
                namespace="shotrip-general",
            )

            print(f"Successfully processed ID: {row['ID']}")
        
        except Exception as e:
            print(f"Error processing record {message_id}: {str(e)}")
            batch_item_failures.append({"itemIdentifier": message_id})

    return {"batchItemFailures": batch_item_failures}