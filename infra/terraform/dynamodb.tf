# --- DynamoDB table definition ---
resource "aws_dynamodb_table" "lens_table" {
  name = "shotrip-prod-lens-table"
  billing_mode = "PAY_PER_REQUEST"
  hash_key = "PK"
  range_key = "SK"
  stream_enabled = true
  stream_view_type = "NEW_AND_OLD_IMAGES"
  deletion_protection_enabled = true
  
  attribute {
    name = "PK"
    type = "S"
  }
  attribute {
    name = "SK"
    type = "S"
  }
  attribute {
    name = "GSI1PK"
    type = "S"
  }
  attribute {
    name = "GSI1SK"
    type = "S"
  }

  ttl {
    attribute_name = "expires_at"
    enabled = true
  }

  point_in_time_recovery {
    enabled = true
  }

  global_secondary_index {
    name = "GSI1"
    key_schema {
      attribute_name = "GSI1PK"
      key_type       = "HASH"
    }
    key_schema {
      attribute_name = "GSI1SK"
      key_type       = "RANGE"
    }
    projection_type = "ALL"
  }

  server_side_encryption {
    enabled = true
    kms_key_arn = null
  }

  tags = {
    Project       = var.project
    Env           = var.env
  }
}