# --- SSM Parameters (String) ---

resource "aws_ssm_parameter" "cognito_user_pool_id" {
  name = "/prod/COGNITO_USER_POOL_ID"
  type = "String"
  value = aws_cognito_user_pool.main.id
  tags = {
    Project = var.project
    Env = var.env
    SecurityLevel = title(var.securitylevel)
  }
}

resource "aws_ssm_parameter" "stripe_price_tokens_100" {
  name = "/prod/STRIPE_PRICE_TOKENS_100"
  type = "String"
  value = var.stripe_price_tokens_100
  tags = {
    Project = var.project
    Env = var.env
    SecurityLevel = title(var.securitylevel)
  }
}

resource "aws_ssm_parameter" "stripe_price_tokens_30" {
  name  = "/prod/STRIPE_PRICE_TOKENS_30"
  type  = "String"
  value = var.stripe_price_tokens_30
  tags = {
    Project = var.project
    Env = var.env
    SecurityLevel = title(var.securitylevel)
  }
}

resource "aws_ssm_parameter" "stripe_price_unlimited_month" {
  name  = "/prod/STRIPE_PRICE_UNLIMITED_MONTH"
  type  = "String"
  value = var.stripe_price_unlimited_month
  tags = {
    Project = var.project
    Env = var.env
    SecurityLevel = title(var.securitylevel)
  }
}

resource "aws_ssm_parameter" "dynamodb_table_name" {
  name  = "/prod/DYNAMODB_TABLE_NAME"
  type  = "String"
  value = "shotrip-prod-lens-table"
  tags = {
    Project       = var.project
    Env           = var.env
    SecurityLevel = title(var.securitylevel)
  }
}

resource "aws_ssm_parameter" "payment_cancel_url" {
  name  = "/prod/PAYMENT_CANCEL_URL"
  type  = "String"
  value = "https://www.shotrip.jp/payment-hub?status=cancel"
  tags = {
    Project       = var.project
    Env           = var.env
    SecurityLevel = title(var.securitylevel)
  }
}

resource "aws_ssm_parameter" "payment_success_url" {
  name  = "/prod/PAYMENT_SUCCESS_URL"
  type  = "String"
  value = "https://www.shotrip.jp/payment-hub?status=success"
  tags = {
    Project       = var.project
    Env           = var.env
    SecurityLevel = title(var.securitylevel)
  }
}

resource "aws_ssm_parameter" "pinecone_index_name" {
  name  = "/prod/PINECONE_INDEX_NAME"
  type  = "String"
  value = "shotrip-prod"
  tags = {
    Project       = var.project
    Env           = var.env
    SecurityLevel = title(var.securitylevel)
  }
}

resource "aws_ssm_parameter" "s3_bucket_name" {
  name  = "/prod/S3_BUCKET_NAME"
  type  = "String"
  value = "shotrip-prod-lens-pics"
  tags = {
    Project       = var.project
    Env           = var.env
    SecurityLevel = title(var.securitylevel)
  }
}

resource "aws_ssm_parameter" "openai_api_key" {
  name  = "/prod/OPENAI_API_KEY"
  type  = "SecureString"
  value = "dummy"
  lifecycle {
    ignore_changes = [value]
  }
  tags = {
    Project       = var.project
    Env           = var.env
    SecurityLevel = title(var.securitylevel)
  }
}

resource "aws_ssm_parameter" "pinecone_api_key" {
  name  = "/prod/PINECONE_API_KEY"
  type  = "SecureString"
  value = "dummy"
  lifecycle {
    ignore_changes = [value]
  }
  tags = {
    Project       = var.project
    Env           = var.env
    SecurityLevel = title(var.securitylevel)
  }
}

resource "aws_ssm_parameter" "stripe_secret_key" {
  name  = "/prod/STRIPE_SECRET_KEY"
  type  = "SecureString"
  value = "dummy"
  lifecycle {
    ignore_changes = [value]
  }
  tags = {
    Project       = var.project
    Env           = var.env
    SecurityLevel = title(var.securitylevel)
  }
}

resource "aws_ssm_parameter" "stripe_webhook_secret" {
  name  = "/prod/STRIPE_WEBHOOK_SECRET"
  type  = "SecureString"
  value = "dummy"
  lifecycle {
    ignore_changes = [value]
  }
  tags = {
    Project       = var.project
    Env           = var.env
    SecurityLevel = title(var.securitylevel)
  }
}