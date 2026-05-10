# --- User pool ---
resource "aws_cognito_user_pool" "main" {
  name = "shotrip-prod-userpool"

  alias_attributes = ["email", "preferred_username"]
  auto_verified_attributes = ["email"]

  password_policy {
    minimum_length = 8
    require_lowercase = true
    require_numbers = true
    require_symbols = true
    require_uppercase = true
    temporary_password_validity_days = 7
  }

  device_configuration {
    challenge_required_on_new_device = true
    device_only_remembered_on_user_prompt = false
  }

  lambda_config {
    post_confirmation = "arn:aws:lambda:${data.aws_region.current.region}:${data.aws_caller_identity.current.account_id}:function:${aws_lambda_function.user_registration.function_name}"
  }

  schema {
    attribute_data_type = "String"
    name = "age"
    mutable = true
    string_attribute_constraints {
      min_length = 2
      max_length = 4
    }
  }

  schema {
    attribute_data_type      = "String"
    name                     = "honorific"
    mutable                  = true
    string_attribute_constraints {
      min_length = 2
      max_length = 10
    }
  }

  schema {
    attribute_data_type      = "String"
    name                     = "nationality"
    mutable                  = true
    string_attribute_constraints {
      min_length = 0
      max_length = 2048
    }
  }

  schema {
    attribute_data_type      = "String"
    name                     = "display_name"
    mutable                  = true
    string_attribute_constraints {
      min_length = 5
      max_length = 20
    }
  }

  tags = {
    Project       = var.project
    Env           = var.env
    SecurityLevel = title(var.securitylevel)
  }
}

# --- External IdP Provider ---
resource "aws_cognito_identity_provider" "google" {
  user_pool_id = aws_cognito_user_pool.main.id
  provider_name = "Google"
  provider_type = "Google"

  provider_details = {
    authorize_scopes = "openid email profile"
    client_id = var.google_client_id
    client_secret = var.google_client_secret
  }

  attribute_mapping = {
    email = "email"
    username = "sub"
  }
}

# --- USer Pool Client ---
resource "aws_cognito_user_pool_client" "client" {
  name = "shotrip-prod-client"
  user_pool_id = aws_cognito_user_pool.main.id
  supported_identity_providers = [ "Google", "COGNITO" ]

  depends_on = [ aws_cognito_identity_provider.google ]

  allowed_oauth_flows = [ "code" ]
  allowed_oauth_scopes = [ "aws.cognito.signin.user.admin", "email", "openid", "profile" ]
  allowed_oauth_flows_user_pool_client = true

  callback_urls = ["https://www.shotrip.jp/auth-callback"]
  logout_urls   = ["https://www.shotrip.jp/auth-callback"]

  refresh_token_validity = 5
  access_token_validity  = 60
  id_token_validity      = 60
  
  token_validity_units {
    refresh_token = "days"
    access_token  = "minutes"
    id_token      = "minutes"
  }
}

# ---Cognito custom domain ---
resource "aws_cognito_user_pool_domain" "main" {
  domain = data.aws_acm_certificate.auth.domain
  certificate_arn = data.aws_acm_certificate.auth.arn
  user_pool_id = aws_cognito_user_pool.main.id
}

# --- Route 53 A record for Cognito domain ---
resource "aws_route53_record" "cognito_domain" {
  name = aws_cognito_user_pool_domain.main.domain
  type = "A"
  zone_id = data.aws_route53_zone.main.zone_id

  alias {
    evaluate_target_health = true
    name = aws_cognito_user_pool_domain.main.cloudfront_distribution
    zone_id = aws_cognito_user_pool_domain.main.cloudfront_distribution_zone_id
  }
}