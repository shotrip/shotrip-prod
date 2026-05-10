# ==========================================
# 1. shotrip-prod-aurorauser-sync
# ==========================================
resource "aws_lambda_function" "aurorauser_sync" {
  function_name = "shotrip-prod-aurorauser-sync"
  role          = aws_iam_role.backend_role.arn
  package_type  = "Image"
  image_uri     = "${aws_ecr_repository.repos["shotrip-prod/shotrip-prod-aurorauser-sync"].repository_url}:latest"
  
  memory_size                    = 256
  timeout                        = 30
  # reserved_concurrent_executions = 20

  vpc_config {
    subnet_ids         = [aws_subnet.fargate_private.id]
    security_group_ids = [aws_security_group.fargate.id]
  }

  environment {
    variables = {
      A_REGION    = data.aws_region.current.region
      DB_CLUSTER  = aws_rds_cluster.main.cluster_identifier
      DB_HOST     = aws_rds_cluster.main.endpoint
      DB_NAME     = "postgres"
      DB_PORT     = "5432"
      DB_USER     = "shotrip-prod-stamp"
      SSLMODE     = "verify-full"
      SSLROOTCERT = "/opt/db/root.crt"
    }
  }

  tags = {
    Project = var.project
    Env     = var.env
  }

  depends_on = [null_resource.push_dummy_image]
}

resource "aws_lambda_function_event_invoke_config" "aurorauser_sync" {
  function_name                = aws_lambda_function.aurorauser_sync.function_name
  maximum_event_age_in_seconds = 21600
  maximum_retry_attempts       = 2
}

resource "aws_lambda_event_source_mapping" "aurorauser_sync_sqs" {
  event_source_arn = aws_sqs_queue.aurorauser_sync.arn 
  function_name    = aws_lambda_function.aurorauser_sync.arn
  batch_size       = 1
}

# ==========================================
# 2. shotrip-prod-chatbot-api
# ==========================================
resource "aws_lambda_function" "chatbot_api" {
  function_name = "shotrip-prod-chatbot-api"
  role          = aws_iam_role.backend_role.arn
  package_type  = "Image"
  image_uri     = "${aws_ecr_repository.repos["shotrip-prod/shotrip-prod-chatbot-api"].repository_url}:latest"
  
  memory_size = 512
  timeout     = 29

  environment {
    variables = {
      SSM_PARAMETER_STORE_TTL = "300"
    }
  }

  tags = {
    Project = var.project
    Env     = var.env
  }

  depends_on = [null_resource.push_dummy_image]
}

resource "aws_lambda_function_event_invoke_config" "chatbot_api" {
  function_name                = aws_lambda_function.chatbot_api.function_name
  maximum_event_age_in_seconds = 21600
  maximum_retry_attempts       = 2
}

resource "aws_lambda_permission" "apigw_chatbot_api" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.chatbot_api.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.rest_api.execution_arn}/*/*"
}

# ==========================================
# 3. shotrip-prod-chatbot-payment
# ==========================================
resource "aws_lambda_function" "chatbot_payment" {
  function_name = "shotrip-prod-chatbot-payment"
  role          = aws_iam_role.backend_role.arn
  package_type  = "Image"
  image_uri     = "${aws_ecr_repository.repos["shotrip-prod/shotrip-prod-chatbot-payment"].repository_url}:latest"
  
  memory_size                    = 512
  timeout                        = 29
  # reserved_concurrent_executions = 50

  image_config {
    command = ["token_payment.handler"]
  }

  environment {
    variables = {
      SSM_PARAMETER_STORE_TTL = "300"
    }
  }

  tags = {
    Project = var.project
    Env     = var.env
  }

  depends_on = [null_resource.push_dummy_image]
}

resource "aws_lambda_function_event_invoke_config" "chatbot_payment" {
  function_name                = aws_lambda_function.chatbot_payment.function_name
  maximum_event_age_in_seconds = 21600
  maximum_retry_attempts       = 2
}

resource "aws_lambda_permission" "apigw_chatbot_payment" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.chatbot_payment.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.rest_api.execution_arn}/*/*"
}

# ==========================================
# 4. shotrip-prod-delete-cognitouser
# ==========================================
resource "aws_lambda_function" "delete_cognitouser" {
  function_name = "shotrip-prod-delete-cognitouser"
  role          = aws_iam_role.backend_role.arn
  
  package_type  = "Zip"
  filename      = data.archive_file.dummy.output_path
  handler       = "index.handler"
  runtime       = "python3.14"

  memory_size                    = 256
  timeout                        = 10
  # reserved_concurrent_executions = 10

  environment {
    variables = {
      SSM_PARAMETER_STORE_TTL = "300"
    }
  }

  tags = {
    Project = var.project
    Env     = var.env
  }

  lifecycle {
    ignore_changes = [filename, source_code_hash]
  }
}

resource "aws_lambda_function_event_invoke_config" "delete_cognitouser" {
  function_name                = aws_lambda_function.delete_cognitouser.function_name
  maximum_event_age_in_seconds = 21600
  maximum_retry_attempts       = 2
}

resource "aws_lambda_permission" "apigw_delete_cognitouser" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.delete_cognitouser.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.rest_api.execution_arn}/*/*"
}

# ==========================================
# 5. shotrip-prod-lenshistory-archiver
# ==========================================
resource "aws_lambda_function" "lenshistory_archiver" {
  function_name = "shotrip-prod-lenshistory-archiver"
  role          = aws_iam_role.backend_role.arn
  
  package_type  = "Zip"
  filename      = data.archive_file.dummy.output_path
  handler       = "index.handler"
  runtime       = "python3.14"

  memory_size                    = 256
  timeout                        = 60
  # reserved_concurrent_executions = 50

  tags = {
    Project = var.project
    Env     = var.env
  }

  lifecycle {
    ignore_changes = [filename, source_code_hash]
  }
}

resource "aws_lambda_function_event_invoke_config" "lenshistory_archiver" {
  function_name                = aws_lambda_function.lenshistory_archiver.function_name
  maximum_event_age_in_seconds = 21600
  maximum_retry_attempts       = 2
}

resource "aws_lambda_event_source_mapping" "lenshistory_archiver_ddb" {
  event_source_arn       = aws_dynamodb_table.lens_table.stream_arn
  function_name          = aws_lambda_function.lenshistory_archiver.arn
  starting_position      = "LATEST"
  batch_size             = 100
  parallelization_factor = 1
}


# ==========================================
# 6. shotrip-prod-rag-otherdata-prep
# ==========================================
resource "aws_lambda_function" "rag_otherdata_prep" {
  function_name = "shotrip-prod-rag-otherdata-prep"
  role          = aws_iam_role.backend_role.arn
  
  package_type  = "Zip"
  filename      = data.archive_file.dummy.output_path
  handler       = "index.handler"
  runtime       = "python3.14"

  memory_size = 512
  timeout     = 300

  environment {
    variables = {
      SQS_QUEUE_URL = aws_sqs_queue.rag_otherdata_queue.url
    }
  }

  tags = {
    Project = var.project
    Env     = var.env
  }

  lifecycle {
    ignore_changes = [filename, source_code_hash]
  }
}

resource "aws_lambda_function_event_invoke_config" "rag_otherdata_prep" {
  function_name                = aws_lambda_function.rag_otherdata_prep.function_name
  maximum_event_age_in_seconds = 21600
  maximum_retry_attempts       = 2
}

resource "aws_lambda_permission" "s3_invoke_rag_otherdata_prep" {
  statement_id  = "AllowS3Invoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.rag_otherdata_prep.function_name
  principal     = "s3.amazonaws.com"
  source_arn    = aws_s3_bucket.lens_ragdata_source.arn
}

# ==========================================
# 7. shotrip-prod-rag-otherdata-processing
# ==========================================
resource "aws_lambda_function" "rag_otherdata_processing" {
  function_name = "shotrip-prod-rag-otherdata-processing"
  role          = aws_iam_role.backend_role.arn
  package_type  = "Image"
  image_uri     = "${aws_ecr_repository.repos["shotrip-prod/shotrip-prod-rag-otherdata-processing"].repository_url}:latest"
  
  memory_size = 1024
  timeout     = 600

  image_config {
    command = ["other-data-ingestion.lambda_handler"]
  }

  environment {
    variables = {
      SSM_PARAMETER_STORE_TTL = "300"
    }
  }

  tags = {
    Project = var.project
    Env     = var.env
  }

  depends_on = [null_resource.push_dummy_image]
}

resource "aws_lambda_function_event_invoke_config" "rag_otherdata_processing" {
  function_name                = aws_lambda_function.rag_otherdata_processing.function_name
  maximum_event_age_in_seconds = 21600
  maximum_retry_attempts       = 2
}

resource "aws_lambda_event_source_mapping" "rag_otherdata_processing_sqs" {
  event_source_arn = aws_sqs_queue.rag_otherdata_queue.arn
  function_name    = aws_lambda_function.rag_otherdata_processing.arn
  batch_size       = 1
}


# ==========================================
# 8. shotrip-prod-rag-spot-fav
# ==========================================
resource "aws_lambda_function" "rag_spot_fav" {
  function_name = "shotrip-prod-rag-spot-fav"
  role          = aws_iam_role.backend_role.arn
  package_type  = "Image"
  image_uri     = "${aws_ecr_repository.repos["shotrip-prod/shotrip-prod-rag-spot-fav"].repository_url}:latest"
  
  memory_size                    = 512
  timeout                        = 29
  # reserved_concurrent_executions = 150

  image_config {
    command = ["spot_fav.handler"]
  }

  environment {
    variables = {
      SSM_PARAMETER_STORE_TTL = "300"
    }
  }

  tags = {
    Project = var.project
    Env     = var.env
  }

  depends_on = [null_resource.push_dummy_image]
}

resource "aws_lambda_function_event_invoke_config" "rag_spot_fav" {
  function_name                = aws_lambda_function.rag_spot_fav.function_name
  maximum_event_age_in_seconds = 21600
  maximum_retry_attempts       = 2
}

resource "aws_lambda_permission" "apigw_rag_spot_fav" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.rag_spot_fav.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.rest_api.execution_arn}/*/*"
}


# ==========================================
# 9. shotrip-prod-rag-spotdata-prep
# ==========================================
resource "aws_lambda_function" "rag_spotdata_prep" {
  function_name = "shotrip-prod-rag-spotdata-prep"
  role          = aws_iam_role.backend_role.arn
  
  package_type  = "Zip"
  filename      = data.archive_file.dummy.output_path
  handler       = "index.handler"
  runtime       = "python3.14"

  memory_size = 512
  timeout     = 300

  environment {
    variables = {
      SQS_QUEUE_URL = aws_sqs_queue.rag_spotdata_queue.url
    }
  }

  tags = {
    Project = var.project
    Env     = var.env
  }

  lifecycle {
    ignore_changes = [filename, source_code_hash]
  }
}

resource "aws_lambda_function_event_invoke_config" "rag_spotdata_prep" {
  function_name                = aws_lambda_function.rag_spotdata_prep.function_name
  maximum_event_age_in_seconds = 21600
  maximum_retry_attempts       = 2
}

resource "aws_lambda_permission" "s3_invoke_rag_spotdata_prep" {
  statement_id  = "AllowS3InvokeSpotData"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.rag_spotdata_prep.function_name
  principal     = "s3.amazonaws.com"
  source_arn    = aws_s3_bucket.lens_ragdata_source.arn
}


# ==========================================
# 10. shotrip-prod-rag-spotdata-processing
# ==========================================
resource "aws_lambda_function" "rag_spotdata_processing" {
  function_name = "shotrip-prod-rag-spotdata-processing"
  role          = aws_iam_role.backend_role.arn
  package_type  = "Image"
  image_uri     = "${aws_ecr_repository.repos["shotrip-prod/shotrip-prod-rag-spotdata-processing"].repository_url}:latest"
  
  memory_size = 1024
  timeout     = 600

  environment {
    variables = {
      SSM_PARAMETER_STORE_TTL = "300"
    }
  }

  tags = {
    Project = var.project
    Env     = var.env
  }

  depends_on = [null_resource.push_dummy_image]
}

resource "aws_lambda_function_event_invoke_config" "rag_spotdata_processing" {
  function_name                = aws_lambda_function.rag_spotdata_processing.function_name
  maximum_event_age_in_seconds = 21600
  maximum_retry_attempts       = 2
}

resource "aws_lambda_event_source_mapping" "rag_spotdata_processing_sqs" {
  event_source_arn = aws_sqs_queue.rag_spotdata_queue.arn
  function_name    = aws_lambda_function.rag_spotdata_processing.arn
  batch_size       = 1
}


# ==========================================
# 11. shotrip-prod-delete-dynamodbuser
# ==========================================
resource "aws_lambda_function" "delete_dynamodbuser" {
  function_name = "shotrip-prod-delete-dynamodbuser"
  role          = aws_iam_role.backend_role.arn
  
  package_type  = "Zip"
  filename      = data.archive_file.dummy.output_path
  handler       = "index.handler"
  runtime       = "python3.14"

  memory_size                    = 256
  timeout                        = 10
  # reserved_concurrent_executions = 10

  environment {
    variables = {
      SSM_PARAMETER_STORE_TTL = "300"
    }
  }

  tags = {
    Project = var.project
    Env     = var.env
  }

  lifecycle {
    ignore_changes = [filename, source_code_hash]
  }
}

resource "aws_lambda_function_event_invoke_config" "delete_dynamodbuser" {
  function_name                = aws_lambda_function.delete_dynamodbuser.function_name
  maximum_event_age_in_seconds = 21600
  maximum_retry_attempts       = 2
}

resource "aws_lambda_permission" "apigw_delete_dynamodbuser" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.delete_dynamodbuser.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.rest_api.execution_arn}/*/*"
}

# ==========================================
# 12. shotrip-prod-user-registration
# ==========================================
resource "aws_lambda_function" "user_registration" {
  function_name = "shotrip-prod-user-registration"
  role          = aws_iam_role.backend_role.arn
  
  package_type  = "Zip"
  filename      = data.archive_file.dummy.output_path
  handler       = "index.handler"
  runtime       = "python3.14"

  memory_size                    = 512
  timeout                        = 5
  # reserved_concurrent_executions = 10

  tags = {
    Project = var.project
    Env     = var.env
  }

  lifecycle {
    ignore_changes = [filename, source_code_hash]
  }
}

resource "aws_lambda_function_event_invoke_config" "user_registration" {
  function_name                = aws_lambda_function.user_registration.function_name
  maximum_event_age_in_seconds = 21600
  maximum_retry_attempts       = 2
}

resource "aws_lambda_permission" "cognito_user_registration" {
  statement_id  = "AllowExecutionFromCognito"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.user_registration.function_name
  principal     = "cognito-idp.amazonaws.com"
  source_arn    = aws_cognito_user_pool.main.arn
}


# ==========================================
# 13. shotrip-prod-dynamodbuser-sync
# ==========================================
resource "aws_lambda_function" "dynamodbuser_sync" {
  function_name                  = "shotrip-prod-dynamodbuser-sync"
  role                           = aws_iam_role.backend_role.arn
  package_type                   = "Zip"
  filename                       = data.archive_file.dummy.output_path
  handler                        = "index.handler"
  runtime                        = "python3.14"
  memory_size                    = 256
  timeout                        = 30
  # reserved_concurrent_executions = 20

  environment {
    variables = {
      SSM_PARAMETER_STORE_TTL = "300"
    }
  }

  tags = {
    Project = var.project
    Env     = var.env
  }

  lifecycle {
    ignore_changes = [filename, source_code_hash]
  }
}

resource "aws_lambda_function_event_invoke_config" "dynamodbuser_sync" {
  function_name                = aws_lambda_function.dynamodbuser_sync.function_name
  maximum_event_age_in_seconds = 21600
  maximum_retry_attempts       = 2
}

resource "aws_lambda_event_source_mapping" "dynamodbuser_sync_sqs" {
  event_source_arn = aws_sqs_queue.dynamouser_sync.arn
  function_name    = aws_lambda_function.dynamodbuser_sync.arn
  batch_size       = 1
}


# ==========================================
# 14. shotrip-prod-dynamodbuser-update
# ==========================================
resource "aws_lambda_function" "dynamodbuser_update" {
  function_name                  = "shotrip-prod-dynamodbuser-update"
  role                           = aws_iam_role.backend_role.arn
  package_type                   = "Zip"
  filename                       = data.archive_file.dummy.output_path
  handler                        = "index.handler"
  runtime                        = "python3.14"
  memory_size                    = 256
  timeout                        = 10
  # reserved_concurrent_executions = 20

  environment {
    variables = {
      SSM_PARAMETER_STORE_TTL = "300"
    }
  }

  tags = {
    Project = var.project
    Env     = var.env
  }

  lifecycle {
    ignore_changes = [filename, source_code_hash]
  }
}

resource "aws_lambda_function_event_invoke_config" "dynamodbuser_update" {
  function_name                = aws_lambda_function.dynamodbuser_update.function_name
  maximum_event_age_in_seconds = 21600
  maximum_retry_attempts       = 2
}

resource "aws_lambda_permission" "apigw_dynamodbuser_update" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.dynamodbuser_update.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.rest_api.execution_arn}/*/*"
}


# ==========================================
# 15. shotrip-prod-lenstoken-scan
# ==========================================
resource "aws_lambda_function" "lenstoken_scan" {
  function_name = "shotrip-prod-lenstoken-scan"
  role          = aws_iam_role.backend_role.arn
  package_type  = "Zip"
  filename      = data.archive_file.dummy.output_path
  handler       = "index.handler"
  runtime       = "python3.14"
  memory_size   = 256
  timeout       = 300

  environment {
    variables = {
      SQS_QUEUE_URL = aws_sqs_queue.lenstoken_reset.url
    }
  }

  tags = {
    Project = var.project
    Env     = var.env
  }

  lifecycle {
    ignore_changes = [filename, source_code_hash]
  }
}

resource "aws_lambda_function_event_invoke_config" "lenstoken_scan" {
  function_name                = aws_lambda_function.lenstoken_scan.function_name
  maximum_event_age_in_seconds = 21600
  maximum_retry_attempts       = 2
}


# ==========================================
# 16. shotrip-prod-lenstoken-reset
# ==========================================
resource "aws_lambda_function" "lenstoken_reset" {
  function_name = "shotrip-prod-lenstoken-reset"
  role          = aws_iam_role.backend_role.arn
  package_type  = "Zip"
  filename      = data.archive_file.dummy.output_path
  handler       = "index.handler"
  runtime       = "python3.14"
  memory_size   = 256
  timeout       = 300

  tags = {
    Project = var.project
    Env     = var.env
  }

  lifecycle {
    ignore_changes = [filename, source_code_hash]
  }

  depends_on = [null_resource.push_dummy_image]
}

resource "aws_lambda_function_event_invoke_config" "lenstoken_reset" {
  function_name                = aws_lambda_function.lenstoken_reset.function_name
  maximum_event_age_in_seconds = 21600
  maximum_retry_attempts       = 2
}

resource "aws_lambda_event_source_mapping" "lenstoken_reset_sqs" {
  event_source_arn = aws_sqs_queue.lenstoken_reset.arn
  function_name    = aws_lambda_function.lenstoken_reset.arn
  batch_size       = 10
}

