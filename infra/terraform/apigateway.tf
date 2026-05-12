# --- REST API ---
resource "aws_api_gateway_rest_api" "rest_api" {
  name        = "shotrip-prod-api-gateway"
  description = "shotrip-prod-api-gateway"

  endpoint_configuration {
    types = ["REGIONAL"]
  }

  api_key_source = "HEADER"
  
  disable_execute_api_endpoint = true 

  tags = {
    Project       = var.project
    Env           = var.env
    SecurityLevel = var.securitylevel
  }
}

# --- Authorizer ---
resource "aws_api_gateway_authorizer" "cognito" {
  name          = "shotrip-prod-userpool"
  rest_api_id   = aws_api_gateway_rest_api.rest_api.id
  type          = "COGNITO_USER_POOLS"
  provider_arns = [aws_cognito_user_pool.main.arn]
  identity_source = "method.request.header.Authorization"
}

# ==========================================
# Common CORS Settings
# ==========================================
locals {
  cors_headers = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
    "method.response.header.Access-Control-Allow-Methods" = "'GET,OPTIONS,POST,PUT,DELETE'",
    "method.response.header.Access-Control-Allow-Origin"  = "'https://www.shotrip.jp'"
  }
}

# ==========================================
# Resource 1: / (Root)
# ==========================================
resource "aws_api_gateway_method" "root_options" {
  rest_api_id   = aws_api_gateway_rest_api.rest_api.id
  resource_id   = aws_api_gateway_rest_api.rest_api.root_resource_id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "root_options" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  resource_id = aws_api_gateway_rest_api.rest_api.root_resource_id
  http_method = aws_api_gateway_method.root_options.http_method
  type        = "MOCK"
  request_templates = { "application/json" = "{\"statusCode\": 200}" }
}

resource "aws_api_gateway_method_response" "root_options_200" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  resource_id = aws_api_gateway_rest_api.rest_api.root_resource_id
  http_method = aws_api_gateway_method.root_options.http_method
  status_code = "200"
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true,
    "method.response.header.Access-Control-Allow-Methods" = true,
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_integration_response" "root_options" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  resource_id = aws_api_gateway_rest_api.rest_api.root_resource_id
  http_method = aws_api_gateway_method.root_options.http_method
  status_code = aws_api_gateway_method_response.root_options_200.status_code
  response_parameters = local.cors_headers
}

# ==========================================
# Resource 2: /chat
# ==========================================
resource "aws_api_gateway_resource" "chat" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  parent_id   = aws_api_gateway_rest_api.rest_api.root_resource_id
  path_part   = "chat"
}

# OPTIONS
resource "aws_api_gateway_method" "chat_options" {
  rest_api_id   = aws_api_gateway_rest_api.rest_api.id
  resource_id   = aws_api_gateway_resource.chat.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "chat_options" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  resource_id = aws_api_gateway_resource.chat.id
  http_method = aws_api_gateway_method.chat_options.http_method
  type        = "MOCK"
  request_templates = { "application/json" = "{\"statusCode\": 200}" }
}

resource "aws_api_gateway_method_response" "chat_options_200" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  resource_id = aws_api_gateway_resource.chat.id
  http_method = aws_api_gateway_method.chat_options.http_method
  status_code = "200"
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true,
    "method.response.header.Access-Control-Allow-Methods" = true,
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_integration_response" "chat_options" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  resource_id = aws_api_gateway_resource.chat.id
  http_method = aws_api_gateway_method.chat_options.http_method
  status_code = aws_api_gateway_method_response.chat_options_200.status_code
  response_parameters = local.cors_headers
}

# POST
resource "aws_api_gateway_method" "chat_post" {
  rest_api_id      = aws_api_gateway_rest_api.rest_api.id
  resource_id      = aws_api_gateway_resource.chat.id
  http_method      = "POST"
  authorization    = "COGNITO_USER_POOLS"
  authorizer_id    = aws_api_gateway_authorizer.cognito.id
  api_key_required = true
}

resource "aws_api_gateway_integration" "chat_post" {
  rest_api_id             = aws_api_gateway_rest_api.rest_api.id
  resource_id             = aws_api_gateway_resource.chat.id
  http_method             = aws_api_gateway_method.chat_post.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "arn:aws:apigateway:${data.aws_region.current.region}:lambda:path/2015-03-31/functions/arn:aws:lambda:${data.aws_region.current.region}:${data.aws_caller_identity.current.account_id}:function:${aws_lambda_function.chatbot_api.function_name}/invocations"
}

# ==========================================
# Resource 3: /chat/like
# ==========================================
resource "aws_api_gateway_resource" "chat_like" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  parent_id   = aws_api_gateway_resource.chat.id
  path_part   = "like"
}

# OPTIONS
resource "aws_api_gateway_method" "chat_like_options" {
  rest_api_id   = aws_api_gateway_rest_api.rest_api.id
  resource_id   = aws_api_gateway_resource.chat_like.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "chat_like_options" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  resource_id = aws_api_gateway_resource.chat_like.id
  http_method = aws_api_gateway_method.chat_like_options.http_method
  type        = "MOCK"
  request_templates = { "application/json" = "{\"statusCode\": 200}" }
}

resource "aws_api_gateway_method_response" "chat_like_options_200" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  resource_id = aws_api_gateway_resource.chat_like.id
  http_method = aws_api_gateway_method.chat_like_options.http_method
  status_code = "200"
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true,
    "method.response.header.Access-Control-Allow-Methods" = true,
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_integration_response" "chat_like_options" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  resource_id = aws_api_gateway_resource.chat_like.id
  http_method = aws_api_gateway_method.chat_like_options.http_method
  status_code = aws_api_gateway_method_response.chat_like_options_200.status_code
  response_parameters = local.cors_headers
}

# PUT
resource "aws_api_gateway_method" "chat_like_put" {
  rest_api_id      = aws_api_gateway_rest_api.rest_api.id
  resource_id      = aws_api_gateway_resource.chat_like.id
  http_method      = "PUT"
  authorization    = "COGNITO_USER_POOLS"
  authorizer_id    = aws_api_gateway_authorizer.cognito.id
  api_key_required = true
}

resource "aws_api_gateway_integration" "chat_like_put" {
  rest_api_id             = aws_api_gateway_rest_api.rest_api.id
  resource_id             = aws_api_gateway_resource.chat_like.id
  http_method             = aws_api_gateway_method.chat_like_put.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "arn:aws:apigateway:${data.aws_region.current.region}:lambda:path/2015-03-31/functions/arn:aws:lambda:${data.aws_region.current.region}:${data.aws_caller_identity.current.account_id}:function:${aws_lambda_function.chatbot_api.function_name}/invocations"
}

# ==========================================
# Resource 4: /history
# ==========================================
resource "aws_api_gateway_resource" "history" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  parent_id   = aws_api_gateway_rest_api.rest_api.root_resource_id
  path_part   = "history"
}

# OPTIONS
resource "aws_api_gateway_method" "history_options" {
  rest_api_id   = aws_api_gateway_rest_api.rest_api.id
  resource_id   = aws_api_gateway_resource.history.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "history_options" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  resource_id = aws_api_gateway_resource.history.id
  http_method = aws_api_gateway_method.history_options.http_method
  type        = "MOCK"
  request_templates = { "application/json" = "{\"statusCode\": 200}" }
}

resource "aws_api_gateway_method_response" "history_options_200" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  resource_id = aws_api_gateway_resource.history.id
  http_method = aws_api_gateway_method.history_options.http_method
  status_code = "200"
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true,
    "method.response.header.Access-Control-Allow-Methods" = true,
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_integration_response" "history_options" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  resource_id = aws_api_gateway_resource.history.id
  http_method = aws_api_gateway_method.history_options.http_method
  status_code = aws_api_gateway_method_response.history_options_200.status_code
  response_parameters = local.cors_headers
}

# GET
resource "aws_api_gateway_method" "history_get" {
  rest_api_id      = aws_api_gateway_rest_api.rest_api.id
  resource_id      = aws_api_gateway_resource.history.id
  http_method      = "GET"
  authorization    = "COGNITO_USER_POOLS"
  authorizer_id    = aws_api_gateway_authorizer.cognito.id
  api_key_required = true
}

resource "aws_api_gateway_integration" "history_get" {
  rest_api_id             = aws_api_gateway_rest_api.rest_api.id
  resource_id             = aws_api_gateway_resource.history.id
  http_method             = aws_api_gateway_method.history_get.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "arn:aws:apigateway:${data.aws_region.current.region}:lambda:path/2015-03-31/functions/arn:aws:lambda:${data.aws_region.current.region}:${data.aws_caller_identity.current.account_id}:function:${aws_lambda_function.chatbot_api.function_name}/invocations"
}

# ==========================================
# Resource 5: /prepare
# ==========================================
resource "aws_api_gateway_resource" "prepare" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  parent_id   = aws_api_gateway_rest_api.rest_api.root_resource_id
  path_part   = "prepare"
}

# OPTIONS
resource "aws_api_gateway_method" "prepare_options" {
  rest_api_id   = aws_api_gateway_rest_api.rest_api.id
  resource_id   = aws_api_gateway_resource.prepare.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "prepare_options" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  resource_id = aws_api_gateway_resource.prepare.id
  http_method = aws_api_gateway_method.prepare_options.http_method
  type        = "MOCK"
  request_templates = { "application/json" = "{\"statusCode\": 200}" }
}

resource "aws_api_gateway_method_response" "prepare_options_200" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  resource_id = aws_api_gateway_resource.prepare.id
  http_method = aws_api_gateway_method.prepare_options.http_method
  status_code = "200"
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true,
    "method.response.header.Access-Control-Allow-Methods" = true,
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_integration_response" "prepare_options" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  resource_id = aws_api_gateway_resource.prepare.id
  http_method = aws_api_gateway_method.prepare_options.http_method
  status_code = aws_api_gateway_method_response.prepare_options_200.status_code
  response_parameters = local.cors_headers
}

# POST
resource "aws_api_gateway_method" "prepare_post" {
  rest_api_id      = aws_api_gateway_rest_api.rest_api.id
  resource_id      = aws_api_gateway_resource.prepare.id
  http_method      = "POST"
  authorization    = "COGNITO_USER_POOLS"
  authorizer_id    = aws_api_gateway_authorizer.cognito.id
  api_key_required = true
}

resource "aws_api_gateway_integration" "prepare_post" {
  rest_api_id             = aws_api_gateway_rest_api.rest_api.id
  resource_id             = aws_api_gateway_resource.prepare.id
  http_method             = aws_api_gateway_method.prepare_post.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "arn:aws:apigateway:${data.aws_region.current.region}:lambda:path/2015-03-31/functions/arn:aws:lambda:${data.aws_region.current.region}:${data.aws_caller_identity.current.account_id}:function:${aws_lambda_function.chatbot_payment.function_name}/invocations"
}

# ==========================================
# Resource 6: /spot
# ==========================================
resource "aws_api_gateway_resource" "spot" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  parent_id   = aws_api_gateway_rest_api.rest_api.root_resource_id
  path_part   = "spot"
}

# OPTIONS
resource "aws_api_gateway_method" "spot_options" {
  rest_api_id   = aws_api_gateway_rest_api.rest_api.id
  resource_id   = aws_api_gateway_resource.spot.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "spot_options" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  resource_id = aws_api_gateway_resource.spot.id
  http_method = aws_api_gateway_method.spot_options.http_method
  type        = "MOCK"
  request_templates = { "application/json" = "{\"statusCode\": 200}" }
}

resource "aws_api_gateway_method_response" "spot_options_200" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  resource_id = aws_api_gateway_resource.spot.id
  http_method = aws_api_gateway_method.spot_options.http_method
  status_code = "200"
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true,
    "method.response.header.Access-Control-Allow-Methods" = true,
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_integration_response" "spot_options" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  resource_id = aws_api_gateway_resource.spot.id
  http_method = aws_api_gateway_method.spot_options.http_method
  status_code = aws_api_gateway_method_response.spot_options_200.status_code
  response_parameters = local.cors_headers
}

# ==========================================
# Resource 7: /spot/fav
# ==========================================
resource "aws_api_gateway_resource" "spot_fav" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  parent_id   = aws_api_gateway_resource.spot.id
  path_part   = "fav"
}

# OPTIONS
resource "aws_api_gateway_method" "spot_fav_options" {
  rest_api_id   = aws_api_gateway_rest_api.rest_api.id
  resource_id   = aws_api_gateway_resource.spot_fav.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "spot_fav_options" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  resource_id = aws_api_gateway_resource.spot_fav.id
  http_method = aws_api_gateway_method.spot_fav_options.http_method
  type        = "MOCK"
  request_templates = { "application/json" = "{\"statusCode\": 200}" }
}

resource "aws_api_gateway_method_response" "spot_fav_options_200" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  resource_id = aws_api_gateway_resource.spot_fav.id
  http_method = aws_api_gateway_method.spot_fav_options.http_method
  status_code = "200"
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true,
    "method.response.header.Access-Control-Allow-Methods" = true,
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_integration_response" "spot_fav_options" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  resource_id = aws_api_gateway_resource.spot_fav.id
  http_method = aws_api_gateway_method.spot_fav_options.http_method
  status_code = aws_api_gateway_method_response.spot_fav_options_200.status_code
  response_parameters = local.cors_headers
}

# GET
resource "aws_api_gateway_method" "spot_fav_get" {
  rest_api_id      = aws_api_gateway_rest_api.rest_api.id
  resource_id      = aws_api_gateway_resource.spot_fav.id
  http_method      = "GET"
  authorization    = "COGNITO_USER_POOLS"
  authorizer_id    = aws_api_gateway_authorizer.cognito.id
  api_key_required = true
}

resource "aws_api_gateway_integration" "spot_fav_get" {
  rest_api_id             = aws_api_gateway_rest_api.rest_api.id
  resource_id             = aws_api_gateway_resource.spot_fav.id
  http_method             = aws_api_gateway_method.spot_fav_get.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "arn:aws:apigateway:${data.aws_region.current.region}:lambda:path/2015-03-31/functions/arn:aws:lambda:${data.aws_region.current.region}:${data.aws_caller_identity.current.account_id}:function:${aws_lambda_function.rag_spot_fav.function_name}/invocations"
}

# PUT
resource "aws_api_gateway_method" "spot_fav_put" {
  rest_api_id      = aws_api_gateway_rest_api.rest_api.id
  resource_id      = aws_api_gateway_resource.spot_fav.id
  http_method      = "PUT"
  authorization    = "COGNITO_USER_POOLS"
  authorizer_id    = aws_api_gateway_authorizer.cognito.id
  api_key_required = true
}

resource "aws_api_gateway_integration" "spot_fav_put" {
  rest_api_id             = aws_api_gateway_rest_api.rest_api.id
  resource_id             = aws_api_gateway_resource.spot_fav.id
  http_method             = aws_api_gateway_method.spot_fav_put.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "arn:aws:apigateway:${data.aws_region.current.region}:lambda:path/2015-03-31/functions/arn:aws:lambda:${data.aws_region.current.region}:${data.aws_caller_identity.current.account_id}:function:${aws_lambda_function.rag_spot_fav.function_name}/invocations"
}


# ==========================================
# Resource 8: /stamp
# ==========================================
resource "aws_api_gateway_resource" "stamp" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  parent_id   = aws_api_gateway_rest_api.rest_api.root_resource_id
  path_part   = "stamp"
}

# OPTIONS
resource "aws_api_gateway_method" "stamp_options" {
  rest_api_id   = aws_api_gateway_rest_api.rest_api.id
  resource_id   = aws_api_gateway_resource.stamp.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "stamp_options" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  resource_id = aws_api_gateway_resource.stamp.id
  http_method = aws_api_gateway_method.stamp_options.http_method
  type        = "MOCK"
  request_templates = { "application/json" = "{\"statusCode\": 200}" }
}

resource "aws_api_gateway_method_response" "stamp_options_200" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  resource_id = aws_api_gateway_resource.stamp.id
  http_method = aws_api_gateway_method.stamp_options.http_method
  status_code = "200"
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true,
    "method.response.header.Access-Control-Allow-Methods" = true,
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_integration_response" "stamp_options" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  resource_id = aws_api_gateway_resource.stamp.id
  http_method = aws_api_gateway_method.stamp_options.http_method
  status_code = aws_api_gateway_method_response.stamp_options_200.status_code
  response_parameters = local.cors_headers
}

# ==========================================
# Resource 9: /stamp/{proxy+}
# ==========================================
resource "aws_api_gateway_resource" "stamp_proxy" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  parent_id   = aws_api_gateway_resource.stamp.id
  path_part   = "{proxy+}"
}

# OPTIONS
resource "aws_api_gateway_method" "stamp_proxy_options" {
  rest_api_id   = aws_api_gateway_rest_api.rest_api.id
  resource_id   = aws_api_gateway_resource.stamp_proxy.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "stamp_proxy_options" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  resource_id = aws_api_gateway_resource.stamp_proxy.id
  http_method = aws_api_gateway_method.stamp_proxy_options.http_method
  type        = "MOCK"
  request_templates = { "application/json" = "{\"statusCode\": 200}" }
}

resource "aws_api_gateway_method_response" "stamp_proxy_options_200" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  resource_id = aws_api_gateway_resource.stamp_proxy.id
  http_method = aws_api_gateway_method.stamp_proxy_options.http_method
  status_code = "200"
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true,
    "method.response.header.Access-Control-Allow-Methods" = true,
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_integration_response" "stamp_proxy_options" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  resource_id = aws_api_gateway_resource.stamp_proxy.id
  http_method = aws_api_gateway_method.stamp_proxy_options.http_method
  status_code = aws_api_gateway_method_response.stamp_proxy_options_200.status_code
  
  response_parameters = merge(local.cors_headers, {
    "method.response.header.Access-Control-Allow-Methods" = "'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT'"
  })
}

# ANY (VPC Link Integration)
resource "aws_api_gateway_method" "stamp_proxy_any" {
  rest_api_id      = aws_api_gateway_rest_api.rest_api.id
  resource_id      = aws_api_gateway_resource.stamp_proxy.id
  http_method      = "ANY"
  authorization    = "COGNITO_USER_POOLS"
  authorizer_id    = aws_api_gateway_authorizer.cognito.id
  api_key_required = true

  request_parameters = {
    "method.request.path.proxy" = true
  }
}

resource "aws_api_gateway_integration" "stamp_proxy_any" {
  rest_api_id             = aws_api_gateway_rest_api.rest_api.id
  resource_id             = aws_api_gateway_resource.stamp_proxy.id
  http_method             = aws_api_gateway_method.stamp_proxy_any.http_method
  integration_http_method = "ANY"
  
  type            = "HTTP_PROXY"
  connection_type = "VPC_LINK"
  connection_id   = aws_apigatewayv2_vpc_link.vpc_link.id

  integration_target = aws_lb.main.arn
  
  uri = "http://${aws_lb.main.dns_name}/stamp/{proxy}"

  request_parameters = {
    "integration.request.path.proxy" = "method.request.path.proxy"
  }
}

# ==========================================
# Resource 10: /user
# ==========================================
resource "aws_api_gateway_resource" "user" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  parent_id   = aws_api_gateway_rest_api.rest_api.root_resource_id
  path_part   = "user"
}

# OPTIONS
resource "aws_api_gateway_method" "user_options" {
  rest_api_id   = aws_api_gateway_rest_api.rest_api.id
  resource_id   = aws_api_gateway_resource.user.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "user_options" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  resource_id = aws_api_gateway_resource.user.id
  http_method = aws_api_gateway_method.user_options.http_method
  type        = "MOCK"
  request_templates = { "application/json" = "{\"statusCode\": 200}" }
}

resource "aws_api_gateway_method_response" "user_options_200" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  resource_id = aws_api_gateway_resource.user.id
  http_method = aws_api_gateway_method.user_options.http_method
  status_code = "200"
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true,
    "method.response.header.Access-Control-Allow-Methods" = true,
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_integration_response" "user_options" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  resource_id = aws_api_gateway_resource.user.id
  http_method = aws_api_gateway_method.user_options.http_method
  status_code = aws_api_gateway_method_response.user_options_200.status_code
  response_parameters = local.cors_headers
}

# ==========================================
# Resource 11: /user/me
# ==========================================
resource "aws_api_gateway_resource" "user_me" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  parent_id   = aws_api_gateway_resource.user.id
  path_part   = "me"
}

# OPTIONS
resource "aws_api_gateway_method" "user_me_options" {
  rest_api_id   = aws_api_gateway_rest_api.rest_api.id
  resource_id   = aws_api_gateway_resource.user_me.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "user_me_options" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  resource_id = aws_api_gateway_resource.user_me.id
  http_method = aws_api_gateway_method.user_me_options.http_method
  type        = "MOCK"
  request_templates = { "application/json" = "{\"statusCode\": 200}" }
}

resource "aws_api_gateway_method_response" "user_me_options_200" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  resource_id = aws_api_gateway_resource.user_me.id
  http_method = aws_api_gateway_method.user_me_options.http_method
  status_code = "200"
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true,
    "method.response.header.Access-Control-Allow-Methods" = true,
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_integration_response" "user_me_options" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  resource_id = aws_api_gateway_resource.user_me.id
  http_method = aws_api_gateway_method.user_me_options.http_method
  status_code = aws_api_gateway_method_response.user_me_options_200.status_code
  response_parameters = local.cors_headers
}

# GET
resource "aws_api_gateway_method" "user_me_get" {
  rest_api_id      = aws_api_gateway_rest_api.rest_api.id
  resource_id      = aws_api_gateway_resource.user_me.id
  http_method      = "GET"
  authorization    = "COGNITO_USER_POOLS"
  authorizer_id    = aws_api_gateway_authorizer.cognito.id
  api_key_required = true
}

resource "aws_api_gateway_integration" "user_me_get" {
  rest_api_id             = aws_api_gateway_rest_api.rest_api.id
  resource_id             = aws_api_gateway_resource.user_me.id
  http_method             = aws_api_gateway_method.user_me_get.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "arn:aws:apigateway:${data.aws_region.current.region}:lambda:path/2015-03-31/functions/arn:aws:lambda:${data.aws_region.current.region}:${data.aws_caller_identity.current.account_id}:function:${aws_lambda_function.chatbot_api.function_name}/invocations"
}

# ==========================================
# Resource 12: /user/me/delete
# ==========================================
resource "aws_api_gateway_resource" "user_me_delete" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  parent_id   = aws_api_gateway_resource.user_me.id
  path_part   = "delete"
}

# OPTIONS
resource "aws_api_gateway_method" "user_me_delete_options" {
  rest_api_id   = aws_api_gateway_rest_api.rest_api.id
  resource_id   = aws_api_gateway_resource.user_me_delete.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "user_me_delete_options" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  resource_id = aws_api_gateway_resource.user_me_delete.id
  http_method = aws_api_gateway_method.user_me_delete_options.http_method
  type        = "MOCK"
  request_templates = { "application/json" = "{\"statusCode\": 200}" }
}

resource "aws_api_gateway_method_response" "user_me_delete_options_200" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  resource_id = aws_api_gateway_resource.user_me_delete.id
  http_method = aws_api_gateway_method.user_me_delete_options.http_method
  status_code = "200"
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true,
    "method.response.header.Access-Control-Allow-Methods" = true,
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_integration_response" "user_me_delete_options" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  resource_id = aws_api_gateway_resource.user_me_delete.id
  http_method = aws_api_gateway_method.user_me_delete_options.http_method
  status_code = aws_api_gateway_method_response.user_me_delete_options_200.status_code
  response_parameters = merge(local.cors_headers, {
    "method.response.header.Access-Control-Allow-Methods" = "'DELETE,OPTIONS,PUT'"
  })
}

# DELETE
resource "aws_api_gateway_method" "user_me_delete_delete" {
  rest_api_id      = aws_api_gateway_rest_api.rest_api.id
  resource_id      = aws_api_gateway_resource.user_me_delete.id
  http_method      = "DELETE"
  authorization    = "COGNITO_USER_POOLS"
  authorizer_id    = aws_api_gateway_authorizer.cognito.id
  api_key_required = true
}

resource "aws_api_gateway_integration" "user_me_delete_delete" {
  rest_api_id             = aws_api_gateway_rest_api.rest_api.id
  resource_id             = aws_api_gateway_resource.user_me_delete.id
  http_method             = aws_api_gateway_method.user_me_delete_delete.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "arn:aws:apigateway:${data.aws_region.current.region}:lambda:path/2015-03-31/functions/arn:aws:lambda:${data.aws_region.current.region}:${data.aws_caller_identity.current.account_id}:function:${aws_lambda_function.delete_cognitouser.function_name}/invocations"
}

# PUT
resource "aws_api_gateway_method" "user_me_delete_put" {
  rest_api_id      = aws_api_gateway_rest_api.rest_api.id
  resource_id      = aws_api_gateway_resource.user_me_delete.id
  http_method      = "PUT"
  authorization    = "COGNITO_USER_POOLS"
  authorizer_id    = aws_api_gateway_authorizer.cognito.id
  api_key_required = true
}

resource "aws_api_gateway_integration" "user_me_delete_put" {
  rest_api_id             = aws_api_gateway_rest_api.rest_api.id
  resource_id             = aws_api_gateway_resource.user_me_delete.id
  http_method             = aws_api_gateway_method.user_me_delete_put.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "arn:aws:apigateway:${data.aws_region.current.region}:lambda:path/2015-03-31/functions/arn:aws:lambda:${data.aws_region.current.region}:${data.aws_caller_identity.current.account_id}:function:${aws_lambda_function.delete_dynamodbuser.function_name}/invocations"
}

# ==========================================
# Resource 13: /user/profile-update
# ==========================================
resource "aws_api_gateway_resource" "user_profile_update" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  parent_id   = aws_api_gateway_resource.user.id
  path_part   = "profile-update"
}

# OPTIONS
resource "aws_api_gateway_method" "user_profile_update_options" {
  rest_api_id   = aws_api_gateway_rest_api.rest_api.id
  resource_id   = aws_api_gateway_resource.user_profile_update.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "user_profile_update_options" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  resource_id = aws_api_gateway_resource.user_profile_update.id
  http_method = aws_api_gateway_method.user_profile_update_options.http_method
  type        = "MOCK"
  request_templates = { "application/json" = "{\"statusCode\": 200}" }
}

resource "aws_api_gateway_method_response" "user_profile_update_options_200" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  resource_id = aws_api_gateway_resource.user_profile_update.id
  http_method = aws_api_gateway_method.user_profile_update_options.http_method
  status_code = "200"
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true,
    "method.response.header.Access-Control-Allow-Methods" = true,
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_integration_response" "user_profile_update_options" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  resource_id = aws_api_gateway_resource.user_profile_update.id
  http_method = aws_api_gateway_method.user_profile_update_options.http_method
  status_code = aws_api_gateway_method_response.user_profile_update_options_200.status_code
  response_parameters = merge(local.cors_headers, {
    "method.response.header.Access-Control-Allow-Methods" = "'OPTIONS,PUT'"
  })
}

# PUT
resource "aws_api_gateway_method" "user_profile_update_put" {
  rest_api_id      = aws_api_gateway_rest_api.rest_api.id
  resource_id      = aws_api_gateway_resource.user_profile_update.id
  http_method      = "PUT"
  authorization    = "COGNITO_USER_POOLS"
  authorizer_id    = aws_api_gateway_authorizer.cognito.id
  api_key_required = true
}

resource "aws_api_gateway_integration" "user_profile_update_put" {
  rest_api_id             = aws_api_gateway_rest_api.rest_api.id
  resource_id             = aws_api_gateway_resource.user_profile_update.id
  http_method             = aws_api_gateway_method.user_profile_update_put.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "arn:aws:apigateway:${data.aws_region.current.region}:lambda:path/2015-03-31/functions/arn:aws:lambda:${data.aws_region.current.region}:${data.aws_caller_identity.current.account_id}:function:${aws_lambda_function.dynamodbuser_update.function_name}/invocations"
}

# ==========================================
# Resource 14: /user/tokens
# ==========================================
resource "aws_api_gateway_resource" "user_tokens" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  parent_id   = aws_api_gateway_resource.user.id
  path_part   = "tokens"
}

# OPTIONS
resource "aws_api_gateway_method" "user_tokens_options" {
  rest_api_id   = aws_api_gateway_rest_api.rest_api.id
  resource_id   = aws_api_gateway_resource.user_tokens.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "user_tokens_options" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  resource_id = aws_api_gateway_resource.user_tokens.id
  http_method = aws_api_gateway_method.user_tokens_options.http_method
  type        = "MOCK"
  request_templates = { "application/json" = "{\"statusCode\": 200}" }
}

resource "aws_api_gateway_method_response" "user_tokens_options_200" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  resource_id = aws_api_gateway_resource.user_tokens.id
  http_method = aws_api_gateway_method.user_tokens_options.http_method
  status_code = "200"
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true,
    "method.response.header.Access-Control-Allow-Methods" = true,
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_integration_response" "user_tokens_options" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  resource_id = aws_api_gateway_resource.user_tokens.id
  http_method = aws_api_gateway_method.user_tokens_options.http_method
  status_code = aws_api_gateway_method_response.user_tokens_options_200.status_code
  response_parameters = merge(local.cors_headers, {
    "method.response.header.Access-Control-Allow-Methods" = "'GET,OPTIONS'"
  })
}

# GET
resource "aws_api_gateway_method" "user_tokens_get" {
  rest_api_id      = aws_api_gateway_rest_api.rest_api.id
  resource_id      = aws_api_gateway_resource.user_tokens.id
  http_method      = "GET"
  authorization    = "COGNITO_USER_POOLS"
  authorizer_id    = aws_api_gateway_authorizer.cognito.id
  api_key_required = true
}

resource "aws_api_gateway_integration" "user_tokens_get" {
  rest_api_id             = aws_api_gateway_rest_api.rest_api.id
  resource_id             = aws_api_gateway_resource.user_tokens.id
  http_method             = aws_api_gateway_method.user_tokens_get.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "arn:aws:apigateway:${data.aws_region.current.region}:lambda:path/2015-03-31/functions/arn:aws:lambda:${data.aws_region.current.region}:${data.aws_caller_identity.current.account_id}:function:${aws_lambda_function.chatbot_api.function_name}/invocations"
}

# ==========================================
# Resource 15: /user/tokens/consume
# ==========================================
resource "aws_api_gateway_resource" "user_tokens_consume" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  parent_id   = aws_api_gateway_resource.user_tokens.id
  path_part   = "consume"
}

# OPTIONS
resource "aws_api_gateway_method" "user_tokens_consume_options" {
  rest_api_id   = aws_api_gateway_rest_api.rest_api.id
  resource_id   = aws_api_gateway_resource.user_tokens_consume.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "user_tokens_consume_options" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  resource_id = aws_api_gateway_resource.user_tokens_consume.id
  http_method = aws_api_gateway_method.user_tokens_consume_options.http_method
  type        = "MOCK"
  request_templates = { "application/json" = "{\"statusCode\": 200}" }
}

resource "aws_api_gateway_method_response" "user_tokens_consume_options_200" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  resource_id = aws_api_gateway_resource.user_tokens_consume.id
  http_method = aws_api_gateway_method.user_tokens_consume_options.http_method
  status_code = "200"
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true,
    "method.response.header.Access-Control-Allow-Methods" = true,
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_integration_response" "user_tokens_consume_options" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  resource_id = aws_api_gateway_resource.user_tokens_consume.id
  http_method = aws_api_gateway_method.user_tokens_consume_options.http_method
  status_code = aws_api_gateway_method_response.user_tokens_consume_options_200.status_code
  response_parameters = merge(local.cors_headers, {
    "method.response.header.Access-Control-Allow-Methods" = "'OPTIONS,POST'"
  })
}

# POST
resource "aws_api_gateway_method" "user_tokens_consume_post" {
  rest_api_id      = aws_api_gateway_rest_api.rest_api.id
  resource_id      = aws_api_gateway_resource.user_tokens_consume.id
  http_method      = "POST"
  authorization    = "COGNITO_USER_POOLS"
  authorizer_id    = aws_api_gateway_authorizer.cognito.id
  api_key_required = true
}

resource "aws_api_gateway_integration" "user_tokens_consume_post" {
  rest_api_id             = aws_api_gateway_rest_api.rest_api.id
  resource_id             = aws_api_gateway_resource.user_tokens_consume.id
  http_method             = aws_api_gateway_method.user_tokens_consume_post.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "arn:aws:apigateway:${data.aws_region.current.region}:lambda:path/2015-03-31/functions/arn:aws:lambda:${data.aws_region.current.region}:${data.aws_caller_identity.current.account_id}:function:${aws_lambda_function.chatbot_api.function_name}/invocations"
}

# ==========================================
# Resource 16: /webhook
# ==========================================
resource "aws_api_gateway_resource" "webhook" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  parent_id   = aws_api_gateway_rest_api.rest_api.root_resource_id
  path_part   = "webhook"
}

# OPTIONS
resource "aws_api_gateway_method" "webhook_options" {
  rest_api_id   = aws_api_gateway_rest_api.rest_api.id
  resource_id   = aws_api_gateway_resource.webhook.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "webhook_options" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  resource_id = aws_api_gateway_resource.webhook.id
  http_method = aws_api_gateway_method.webhook_options.http_method
  type        = "MOCK"
  request_templates = { "application/json" = "{\"statusCode\": 200}" }
}

resource "aws_api_gateway_method_response" "webhook_options_200" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  resource_id = aws_api_gateway_resource.webhook.id
  http_method = aws_api_gateway_method.webhook_options.http_method
  status_code = "200"
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true,
    "method.response.header.Access-Control-Allow-Methods" = true,
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_integration_response" "webhook_options" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  resource_id = aws_api_gateway_resource.webhook.id
  http_method = aws_api_gateway_method.webhook_options.http_method
  status_code = aws_api_gateway_method_response.webhook_options_200.status_code
  response_parameters = merge(local.cors_headers, {
    "method.response.header.Access-Control-Allow-Origin" = "'*'",
    "method.response.header.Access-Control-Allow-Methods" = "'OPTIONS'"
  })
}

# ==========================================
# Resource 17: /webhook/stripe
# ==========================================
resource "aws_api_gateway_resource" "webhook_stripe" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  parent_id   = aws_api_gateway_resource.webhook.id
  path_part   = "stripe"
}

# OPTIONS
resource "aws_api_gateway_method" "webhook_stripe_options" {
  rest_api_id   = aws_api_gateway_rest_api.rest_api.id
  resource_id   = aws_api_gateway_resource.webhook_stripe.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "webhook_stripe_options" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  resource_id = aws_api_gateway_resource.webhook_stripe.id
  http_method = aws_api_gateway_method.webhook_stripe_options.http_method
  type        = "MOCK"
  request_templates = { "application/json" = "{\"statusCode\": 200}" }
}

resource "aws_api_gateway_method_response" "webhook_stripe_options_200" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  resource_id = aws_api_gateway_resource.webhook_stripe.id
  http_method = aws_api_gateway_method.webhook_stripe_options.http_method
  status_code = "200"
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true,
    "method.response.header.Access-Control-Allow-Methods" = true,
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_integration_response" "webhook_stripe_options" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  resource_id = aws_api_gateway_resource.webhook_stripe.id
  http_method = aws_api_gateway_method.webhook_stripe_options.http_method
  status_code = aws_api_gateway_method_response.webhook_stripe_options_200.status_code
  response_parameters = merge(local.cors_headers, {
    "method.response.header.Access-Control-Allow-Origin" = "'*'",
    "method.response.header.Access-Control-Allow-Methods" = "'OPTIONS,POST'"
  })
}

resource "aws_api_gateway_method" "webhook_stripe_post" {
  rest_api_id      = aws_api_gateway_rest_api.rest_api.id
  resource_id      = aws_api_gateway_resource.webhook_stripe.id
  http_method      = "POST"
  authorization    = "NONE"
  api_key_required = false
}

resource "aws_api_gateway_integration" "webhook_stripe_post" {
  rest_api_id             = aws_api_gateway_rest_api.rest_api.id
  resource_id             = aws_api_gateway_resource.webhook_stripe.id
  http_method             = aws_api_gateway_method.webhook_stripe_post.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "arn:aws:apigateway:${data.aws_region.current.region}:lambda:path/2015-03-31/functions/arn:aws:lambda:${data.aws_region.current.region}:${data.aws_caller_identity.current.account_id}:function:${aws_lambda_function.chatbot_payment.function_name}/invocations"
}

# --- Deployment ---
resource "aws_api_gateway_deployment" "deployment" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  triggers = {
    redeployment = sha1(jsonencode([
      aws_api_gateway_rest_api.rest_api.body,
      # Methods & Integrations
      aws_api_gateway_method.root_options.id, aws_api_gateway_integration.root_options.id,
      aws_api_gateway_method.chat_options.id, aws_api_gateway_integration.chat_options.id,
      aws_api_gateway_method.chat_post.id, aws_api_gateway_integration.chat_post.id,
      aws_api_gateway_method.chat_like_options.id, aws_api_gateway_integration.chat_like_options.id,
      aws_api_gateway_method.chat_like_put.id, aws_api_gateway_integration.chat_like_put.id,
      aws_api_gateway_method.history_options.id, aws_api_gateway_integration.history_options.id,
      aws_api_gateway_method.history_get.id, aws_api_gateway_integration.history_get.id,
      aws_api_gateway_method.prepare_options.id, aws_api_gateway_integration.prepare_options.id,
      aws_api_gateway_method.prepare_post.id, aws_api_gateway_integration.prepare_post.id,
      aws_api_gateway_method.spot_options.id, aws_api_gateway_integration.spot_options.id,
      aws_api_gateway_method.spot_fav_options.id, aws_api_gateway_integration.spot_fav_options.id,
      aws_api_gateway_method.spot_fav_get.id, aws_api_gateway_integration.spot_fav_get.id,
      aws_api_gateway_method.spot_fav_put.id, aws_api_gateway_integration.spot_fav_put.id,
      aws_api_gateway_method.stamp_options.id, aws_api_gateway_integration.stamp_options.id,
      aws_api_gateway_method.stamp_proxy_options.id, aws_api_gateway_integration.stamp_proxy_options.id,
      aws_api_gateway_method.stamp_proxy_any.id, aws_api_gateway_integration.stamp_proxy_any.id,
      aws_api_gateway_method.user_options.id, aws_api_gateway_integration.user_options.id,
      aws_api_gateway_method.user_me_options.id, aws_api_gateway_integration.user_me_options.id,
      aws_api_gateway_method.user_me_get.id, aws_api_gateway_integration.user_me_get.id,
      aws_api_gateway_method.user_me_delete_options.id, aws_api_gateway_integration.user_me_delete_options.id,
      aws_api_gateway_method.user_me_delete_delete.id, aws_api_gateway_integration.user_me_delete_delete.id,
      aws_api_gateway_method.user_me_delete_put.id, aws_api_gateway_integration.user_me_delete_put.id,
      aws_api_gateway_method.user_profile_update_options.id, aws_api_gateway_integration.user_profile_update_options.id,
      aws_api_gateway_method.user_profile_update_put.id, aws_api_gateway_integration.user_profile_update_put.id,
      aws_api_gateway_method.user_tokens_options.id, aws_api_gateway_integration.user_tokens_options.id,
      aws_api_gateway_method.user_tokens_get.id, aws_api_gateway_integration.user_tokens_get.id,
      aws_api_gateway_method.user_tokens_consume_options.id, aws_api_gateway_integration.user_tokens_consume_options.id,
      aws_api_gateway_method.user_tokens_consume_post.id, aws_api_gateway_integration.user_tokens_consume_post.id,
      aws_api_gateway_method.webhook_options.id, aws_api_gateway_integration.webhook_options.id,
      aws_api_gateway_method.webhook_stripe_options.id, aws_api_gateway_integration.webhook_stripe_options.id,
      aws_api_gateway_method.webhook_stripe_post.id, aws_api_gateway_integration.webhook_stripe_post.id
    ]))
  }
  lifecycle { create_before_destroy = true }
}

# --- Stage ---
resource "aws_api_gateway_stage" "prod" {
  deployment_id = aws_api_gateway_deployment.deployment.id
  rest_api_id   = aws_api_gateway_rest_api.rest_api.id
  stage_name    = "shotrip-prod-1"

  tags = {
    Project       = var.project
    Env           = var.env
    SecurityLevel = var.securitylevel
  }
}

# --- API Key ---
resource "aws_api_gateway_api_key" "api_key" {
  name    = "shotrip-prod-api-key"
  enabled = true

  tags = {
    Project       = var.project
    Env           = var.env
    SecurityLevel = var.securitylevel
  }
}

# --- Usage Plan ---
resource "aws_api_gateway_usage_plan" "usage_plan" {
  name        = "shotrip-prod-usage-plan"
  description = "shotrip-prod-usage-plan"

  api_stages {
    api_id = aws_api_gateway_rest_api.rest_api.id
    stage  = aws_api_gateway_stage.prod.stage_name
  }

  throttle_settings {
    rate_limit  = 1000
    burst_limit = 500
  }

  tags = {
    Project       = var.project
    Env           = var.env
    SecurityLevel = var.securitylevel
  }
}

resource "aws_api_gateway_usage_plan_key" "main" {
  key_id        = aws_api_gateway_api_key.api_key.id
  key_type      = "API_KEY"
  usage_plan_id = aws_api_gateway_usage_plan.usage_plan.id
}

# --- Method Settings ---
resource "aws_api_gateway_method_settings" "default" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  stage_name  = aws_api_gateway_stage.prod.stage_name
  method_path = "*/*"

  settings {
    throttling_rate_limit  = 1000
    throttling_burst_limit = 500
  }
}

# --- Custom Domain Name ---
resource "aws_api_gateway_domain_name" "api_domain" {
  domain_name              = data.aws_acm_certificate.api.domain
  regional_certificate_arn = data.aws_acm_certificate.api.arn
  security_policy          = "SecurityPolicy_TLS13_1_3_2025_09"
  endpoint_access_mode     = "STRICT"

  endpoint_configuration {
    types            = ["REGIONAL"]
    ip_address_type  = "ipv4"
  }
}

resource "aws_api_gateway_base_path_mapping" "api_mapping" {
  api_id      = aws_api_gateway_rest_api.rest_api.id
  stage_name  = aws_api_gateway_stage.prod.stage_name
  domain_name = aws_api_gateway_domain_name.api_domain.domain_name
}

# --- VPC Link ---
resource "aws_apigatewayv2_vpc_link" "vpc_link" {
  name        = "shotrip-prod-vpc-links"
  security_group_ids = [aws_security_group.alb.id]
  subnet_ids         = [aws_subnet.alb_private_01.id, aws_subnet.alb_private_02.id]

  tags = {
    Project       = var.project
    Env           = var.env
    SecurityLevel = title(var.securitylevel)
  }
}