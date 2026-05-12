# ==========================================
# SQS Standard Queues (Main Queues)
# ==========================================
# 1. shotrip-prod-aurorauser-sync-queue
resource "aws_sqs_queue" "aurorauser_sync" {
  name                       = "shotrip-prod-aurorauser-sync-queue"
  message_retention_seconds  = 345600
  max_message_size           = 1048576
  visibility_timeout_seconds = 180
  receive_wait_time_seconds  = 20
  sqs_managed_sse_enabled    = true
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.aurorauser_sync_dlq.arn
    maxReceiveCount     = 3
  })
  tags = { Env = var.env, Project = var.project, SecurityLevel = title(var.securitylevel) }
}

resource "aws_sqs_queue_policy" "aurorauser_sync" {
  queue_url = aws_sqs_queue.aurorauser_sync.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Service = "events.amazonaws.com" }
      Action    = "sqs:SendMessage"
      Resource  = aws_sqs_queue.aurorauser_sync.arn
      Condition = {
        ArnEquals = {
          "aws:SourceArn" = "arn:aws:events:${data.aws_region.current.region}:${data.aws_caller_identity.current.account_id}:rule/${aws_cloudwatch_event_rule.aurorauser_sync.name}"
        }
      }
    }]
  })
}

# 2. shotrip-prod-rag-otherdata-queue
resource "aws_sqs_queue" "rag_otherdata_queue" {
  name                       = "shotrip-prod-rag-otherdata-queue"
  message_retention_seconds  = 345600
  max_message_size           = 1048576
  visibility_timeout_seconds = 3600
  receive_wait_time_seconds  = 20
  sqs_managed_sse_enabled    = true
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.ragotherdata_dlq.arn
    maxReceiveCount     = 5
  })
  tags = { Env = var.env, Project = var.project, SecurityLevel = title(var.securitylevel) }
}
resource "aws_sqs_queue_policy" "rag_otherdata_queue" {
  queue_url = aws_sqs_queue.rag_otherdata_queue.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Sid       = "AllowLambdaAccess"
      Effect    = "Allow"
      Principal = { AWS = aws_iam_role.backend_role.arn }
      Action    = ["sqs:SendMessage", "sqs:ReceiveMessage", "sqs:DeleteMessage", "sqs:GetQueueAttributes"]
      Resource  = aws_sqs_queue.rag_otherdata_queue.arn
    }]
  })
}

# 3. shotrip-prod-rag-spotdata-queue
resource "aws_sqs_queue" "rag_spotdata_queue" {
  name                       = "shotrip-prod-rag-spotdata-queue"
  message_retention_seconds  = 345600
  max_message_size           = 1048576
  visibility_timeout_seconds = 3600
  receive_wait_time_seconds  = 20
  sqs_managed_sse_enabled    = true
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.ragspotdata_dlq.arn
    maxReceiveCount     = 5
  })
  tags = { Env = var.env, Project = var.project, SecurityLevel = title(var.securitylevel) }
}
resource "aws_sqs_queue_policy" "rag_spotdata_queue" {
  queue_url = aws_sqs_queue.rag_spotdata_queue.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Sid       = "AllowLambdaAccess"
      Effect    = "Allow"
      Principal = { AWS = aws_iam_role.backend_role.arn }
      Action    = ["sqs:SendMessage", "sqs:ReceiveMessage", "sqs:DeleteMessage", "sqs:GetQueueAttributes"]
      Resource  = aws_sqs_queue.rag_spotdata_queue.arn
    }]
  })
}

# 4. shotrip-prod-dynamouser-sync-queue
resource "aws_sqs_queue" "dynamouser_sync" {
  name                       = "shotrip-prod-dynamouser-sync-queue"
  message_retention_seconds  = 345600
  max_message_size           = 1048576
  visibility_timeout_seconds = 180
  receive_wait_time_seconds  = 20
  sqs_managed_sse_enabled    = true
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.dynamouser_sync_dlq.arn
    maxReceiveCount     = 3
  })
  tags = { Env = var.env, Project = var.project, SecurityLevel = title(var.securitylevel) }
}
resource "aws_sqs_queue_policy" "dynamouser_sync" {
  queue_url = aws_sqs_queue.dynamouser_sync.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Service = "events.amazonaws.com" }
      Action    = "sqs:SendMessage"
      Resource  = aws_sqs_queue.dynamouser_sync.arn
      Condition = {
        ArnEquals = {
          "aws:SourceArn" = "arn:aws:events:${data.aws_region.current.region}:${data.aws_caller_identity.current.account_id}:rule/${aws_cloudwatch_event_rule.dynamodbuser_sync.name}"
        }
      }
    }]
  })
}

# 5. shotrip-prod-lenstoken-reset-queue
resource "aws_sqs_queue" "lenstoken_reset" {
  name                       = "shotrip-prod-lenstoken-reset-queue"
  message_retention_seconds  = 345600
  max_message_size           = 1048576
  visibility_timeout_seconds = 1800
  receive_wait_time_seconds  = 20
  sqs_managed_sse_enabled    = true
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.lenstoken_reset_dlq.arn
    maxReceiveCount     = 3
  })
  tags = { Env = var.env, Project = var.project, SecurityLevel = title(var.securitylevel) }
}
resource "aws_sqs_queue_policy" "lenstoken_reset" {
  queue_url = aws_sqs_queue.lenstoken_reset.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Sid       = "AllowLambdaAccess"
      Effect    = "Allow"
      Principal = { AWS = aws_iam_role.backend_role.arn }
      Action    = ["sqs:SendMessage", "sqs:ReceiveMessage", "sqs:DeleteMessage", "sqs:GetQueueAttributes"]
      Resource  = aws_sqs_queue.lenstoken_reset.arn
    }]
  })
}


# ==========================================
# SQS Dead-Letter Queues (DLQ)
# ==========================================
# 1. shotrip-prod-aurorauser-sync-dlq
resource "aws_sqs_queue" "aurorauser_sync_dlq" {
  name                       = "shotrip-prod-aurorauser-sync-dlq"
  message_retention_seconds  = 1209600
  max_message_size           = 1048576
  visibility_timeout_seconds = 180
  receive_wait_time_seconds  = 20
  sqs_managed_sse_enabled    = true
  tags = { Env = var.env, Project = var.project, SecurityLevel = title(var.securitylevel) }
}
resource "aws_sqs_queue_policy" "aurorauser_sync_dlq" {
  queue_url = aws_sqs_queue.aurorauser_sync_dlq.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Sid       = "OwnerAccess"
      Effect    = "Allow"
      Principal = { AWS = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:root" }
      Action    = "SQS:*"
      Resource  = "arn:aws:sqs:${data.aws_region.current.region}:${data.aws_caller_identity.current.account_id}:shotrip-prod-*-dlq"
    }]
  })
}
resource "aws_sqs_queue_redrive_allow_policy" "aurorauser_sync_dlq" {
  queue_url = aws_sqs_queue.aurorauser_sync_dlq.id
  redrive_allow_policy = jsonencode({
    redrivePermission = "byQueue"
    sourceQueueArns   = [aws_sqs_queue.aurorauser_sync.arn]
  })
}

# 2. shotrip-prod-ragotherdata-dlq
resource "aws_sqs_queue" "ragotherdata_dlq" {
  name                       = "shotrip-prod-ragotherdata-dlq"
  message_retention_seconds  = 1209600
  max_message_size           = 1048576
  visibility_timeout_seconds = 3600
  receive_wait_time_seconds  = 20
  sqs_managed_sse_enabled    = true
  tags = { Env = var.env, Project = var.project, SecurityLevel = title(var.securitylevel) }
}
resource "aws_sqs_queue_policy" "ragotherdata_dlq" {
  queue_url = aws_sqs_queue.ragotherdata_dlq.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Sid       = "OwnerAccess"
      Effect    = "Allow"
      Principal = { AWS = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:root" }
      Action    = "SQS:*"
      Resource  = "arn:aws:sqs:${data.aws_region.current.region}:${data.aws_caller_identity.current.account_id}:shotrip-prod-*-dlq"
    }]
  })
}
resource "aws_sqs_queue_redrive_allow_policy" "ragotherdata_dlq" {
  queue_url = aws_sqs_queue.ragotherdata_dlq.id
  redrive_allow_policy = jsonencode({
    redrivePermission = "byQueue"
    sourceQueueArns   = [aws_sqs_queue.rag_otherdata_queue.arn]
  })
}

# 3. shotrip-prod-ragspotdata-dlq
resource "aws_sqs_queue" "ragspotdata_dlq" {
  name                       = "shotrip-prod-ragspotdata-dlq"
  message_retention_seconds  = 1209600
  max_message_size           = 1048576
  visibility_timeout_seconds = 3600
  receive_wait_time_seconds  = 20
  sqs_managed_sse_enabled    = true
  tags = { Env = var.env, Project = var.project, SecurityLevel = title(var.securitylevel) }
}
resource "aws_sqs_queue_policy" "ragspotdata_dlq" {
  queue_url = aws_sqs_queue.ragspotdata_dlq.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Sid       = "OwnerAccess"
      Effect    = "Allow"
      Principal = { AWS = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:root" }
      Action    = "SQS:*"
      Resource  = "arn:aws:sqs:${data.aws_region.current.region}:${data.aws_caller_identity.current.account_id}:shotrip-prod-*-dlq"
    }]
  })
}
resource "aws_sqs_queue_redrive_allow_policy" "ragspotdata_dlq" {
  queue_url = aws_sqs_queue.ragspotdata_dlq.id
  redrive_allow_policy = jsonencode({
    redrivePermission = "byQueue"
    sourceQueueArns   = [aws_sqs_queue.rag_spotdata_queue.arn]
  })
}

# 4. shotrip-prod-dynamouser-sync-dlq
resource "aws_sqs_queue" "dynamouser_sync_dlq" {
  name                       = "shotrip-prod-dynamouser-sync-dlq"
  message_retention_seconds  = 1209600
  max_message_size           = 1048576
  visibility_timeout_seconds = 180
  receive_wait_time_seconds  = 20
  sqs_managed_sse_enabled    = true
  tags = { Env = var.env, Project = var.project, SecurityLevel = title(var.securitylevel) }
}
resource "aws_sqs_queue_policy" "dynamouser_sync_dlq" {
  queue_url = aws_sqs_queue.dynamouser_sync_dlq.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Sid       = "OwnerAccess"
      Effect    = "Allow"
      Principal = { AWS = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:root" }
      Action    = "SQS:*"
      Resource  = "arn:aws:sqs:${data.aws_region.current.region}:${data.aws_caller_identity.current.account_id}:shotrip-prod-*-dlq"
    }]
  })
}
resource "aws_sqs_queue_redrive_allow_policy" "dynamouser_sync_dlq" {
  queue_url = aws_sqs_queue.dynamouser_sync_dlq.id
  redrive_allow_policy = jsonencode({
    redrivePermission = "byQueue"
    sourceQueueArns   = [aws_sqs_queue.dynamouser_sync.arn]
  })
}

# 5. shotrip-prod-lenstoken-reset-dlq
resource "aws_sqs_queue" "lenstoken_reset_dlq" {
  name                       = "shotrip-prod-lenstoken-reset-dlq"
  message_retention_seconds  = 1209600
  max_message_size           = 262144
  visibility_timeout_seconds = 1800
  receive_wait_time_seconds  = 20
  sqs_managed_sse_enabled    = true
  tags = { Env = var.env, Project = var.project, SecurityLevel = title(var.securitylevel) }
}
resource "aws_sqs_queue_policy" "lenstoken_reset_dlq" {
  queue_url = aws_sqs_queue.lenstoken_reset_dlq.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Sid       = "OwnerAccess"
      Effect    = "Allow"
      Principal = { AWS = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:root" }
      Action    = "SQS:*"
      Resource  = "arn:aws:sqs:${data.aws_region.current.region}:${data.aws_caller_identity.current.account_id}:shotrip-prod-*-dlq"
    }]
  })
}
resource "aws_sqs_queue_redrive_allow_policy" "lenstoken_reset_dlq" {
  queue_url = aws_sqs_queue.lenstoken_reset_dlq.id
  redrive_allow_policy = jsonencode({
    redrivePermission = "byQueue"
    sourceQueueArns   = [aws_sqs_queue.lenstoken_reset.arn]
  })
}