# # ==========================================
# # 1. shotrip-prod-cf-4xx
# # ==========================================
# resource "aws_cloudwatch_metric_alarm" "cf_4xx" {
#   provider            = aws.virginia
#   alarm_name          = "shotrip-prod-cf-4xx"
#   comparison_operator = "GreaterThanOrEqualToThreshold"
#   evaluation_periods  = "1"
#   metric_name         = "4xxErrorRate"
#   namespace           = "AWS/CloudFront"
#   period              = "300"
#   statistic           = "Average"
#   threshold           = "1"
#   treat_missing_data  = "missing"

#   dimensions = {
#     DistributionId = aws_cloudfront_distribution.main.id
#     Region         = "Global"
#   }

#   alarm_actions = [aws_sns_topic.urgent_alert_global.arn]

#   tags = {
#     Env           = var.env
#     Project       = var.project
#     SecurityLevel = title(var.securitylevel)
#   }
# }

# # ==========================================
# # 2. shotrip-prod-cf-5xx
# # ==========================================
# resource "aws_cloudwatch_metric_alarm" "cf_5xx" {
#   provider            = aws.virginia
#   alarm_name          = "shotrip-prod-cf-5xx"
#   comparison_operator = "GreaterThanOrEqualToThreshold"
#   evaluation_periods  = "1"
#   metric_name         = "5xxErrorRate"
#   namespace           = "AWS/CloudFront"
#   period              = "300"
#   statistic           = "Average"
#   threshold           = "1"
#   treat_missing_data  = "missing"

#   dimensions = {
#     DistributionId = aws_cloudfront_distribution.main.id
#     Region         = "Global"
#   }

#   alarm_actions = [aws_sns_topic.urgent_alert_global.arn]

#   tags = {
#     Env           = var.env
#     Project       = var.project
#     SecurityLevel = title(var.securitylevel)
#   }
# }

# # ==========================================
# # 3. shotrip-prod-alb-5xx
# # ==========================================
# resource "aws_cloudwatch_metric_alarm" "alb_5xx" {
#   alarm_name          = "shotrip-prod-alb-5xx"
#   comparison_operator = "GreaterThanOrEqualToThreshold"
#   evaluation_periods  = "1"
#   metric_name         = "HTTPCode_ELB_5XX_Count"
#   namespace           = "AWS/ApplicationELB"
#   period              = "60"
#   statistic           = "Average"
#   threshold           = "5"
#   treat_missing_data  = "missing"

#   dimensions = {
#     LoadBalancer = aws_lb.main.arn_suffix
#   }

#   alarm_actions = [aws_sns_topic.urgent_alert.arn]

#   tags = {
#     Env           = var.env
#     Project       = var.project
#     SecurityLevel = title(var.securitylevel)
#   }
# }

# # ==========================================
# # 4. shotrip-prod-apigw-5xx
# # ==========================================
# resource "aws_cloudwatch_metric_alarm" "apigw_5xx" {
#   alarm_name          = "shotrip-prod-apigw-5xx"
#   comparison_operator = "GreaterThanOrEqualToThreshold"
#   evaluation_periods  = "1"
#   metric_name         = "5XXError"
#   namespace           = "AWS/ApiGateway"
#   period              = "60"
#   statistic           = "Average"
#   threshold           = "1"
#   treat_missing_data  = "missing"

#   dimensions = {
#     ApiName = aws_api_gateway_rest_api.rest_api.name
#   }

#   alarm_actions = [aws_sns_topic.urgent_alert.arn]

#   tags = {
#     Env           = var.env
#     Project       = var.project
#     SecurityLevel = title(var.securitylevel)
#   }
# }

# # ==========================================
# # 5. shotrip-prod-ecs-cpu
# # ==========================================
# resource "aws_cloudwatch_metric_alarm" "ecs_cpu" {
#   alarm_name          = "shotrip-prod-ecs-cpu"
#   comparison_operator = "GreaterThanOrEqualToThreshold"
#   evaluation_periods  = "1"
#   metric_name         = "CPUUtilization"
#   namespace           = "AWS/ECS"
#   period              = "300"
#   statistic           = "Average"
#   threshold           = "80"
#   treat_missing_data  = "missing"

#   dimensions = {
#     ClusterName = aws_ecs_cluster.main.name
#     ServiceName = aws_ecs_service.stamp.name
#   }

#   alarm_actions = [aws_sns_topic.urgent_alert.arn]

#   tags = {
#     Env           = var.env
#     Project       = var.project
#     SecurityLevel = title(var.securitylevel)
#   }
# }

# # ==========================================
# # 6. shotrip-prod-ecs-mem
# # ==========================================
# resource "aws_cloudwatch_metric_alarm" "ecs_mem" {
#   alarm_name          = "shotrip-prod-ecs-mem"
#   comparison_operator = "GreaterThanOrEqualToThreshold"
#   evaluation_periods  = "1"
#   metric_name         = "MemoryUtilization"
#   namespace           = "AWS/ECS"
#   period              = "300"
#   statistic           = "Average"
#   threshold           = "80"
#   treat_missing_data  = "missing"

#   dimensions = {
#     ClusterName = aws_ecs_cluster.main.name
#     ServiceName = aws_ecs_service.stamp.name
#   }

#   alarm_actions = [aws_sns_topic.urgent_alert.arn]

#   tags = {
#     Env           = var.env
#     Project       = var.project
#     SecurityLevel = title(var.securitylevel)
#   }
# }

# # ==========================================
# # 7. shotrip-prod-lambda-err-aurorauser-sync
# # ==========================================
# resource "aws_cloudwatch_metric_alarm" "lambda_err_aurorauser_sync" {
#   alarm_name          = "shotrip-prod-lambda-err-aurorauser-sync"
#   comparison_operator = "GreaterThanOrEqualToThreshold"
#   evaluation_periods  = "1"
#   metric_name         = "Errors"
#   namespace           = "AWS/Lambda"
#   period              = "60"
#   statistic           = "Average"
#   threshold           = "1"
#   treat_missing_data  = "missing"

#   dimensions = {
#     FunctionName = aws_lambda_function.aurorauser_sync.function_name
#   }

#   alarm_actions = [aws_sns_topic.urgent_alert.arn]

#   tags = {
#     Env           = var.env
#     Project       = var.project
#     SecurityLevel = title(var.securitylevel)
#   }
# }

# # ==========================================
# # 8. shotrip-prod-lambda-err-chatbot-api
# # ==========================================
# resource "aws_cloudwatch_metric_alarm" "lambda_err_chatbot_api" {
#   alarm_name          = "shotrip-prod-lambda-err-chatbot-api"
#   comparison_operator = "GreaterThanOrEqualToThreshold"
#   evaluation_periods  = "1"
#   metric_name         = "Errors"
#   namespace           = "AWS/Lambda"
#   period              = "60"
#   statistic           = "Average"
#   threshold           = "1"
#   treat_missing_data  = "missing"

#   dimensions = {
#     FunctionName = aws_lambda_function.chatbot_api.function_name
#   }

#   alarm_actions = [aws_sns_topic.urgent_alert.arn]

#   tags = {
#     Env           = var.env
#     Project       = var.project
#     SecurityLevel = title(var.securitylevel)
#   }
# }

# # ==========================================
# # 9. shotrip-prod-lambda-err-chatbot-payment
# # ==========================================
# resource "aws_cloudwatch_metric_alarm" "lambda_err_chatbot_payment" {
#   alarm_name          = "shotrip-prod-lambda-err-chatbot-payment"
#   comparison_operator = "GreaterThanOrEqualToThreshold"
#   evaluation_periods  = "1"
#   metric_name         = "Errors"
#   namespace           = "AWS/Lambda"
#   period              = "60"
#   statistic           = "Average"
#   threshold           = "1"
#   treat_missing_data  = "missing"

#   dimensions = {
#     FunctionName = aws_lambda_function.chatbot_payment.function_name
#   }

#   alarm_actions = [aws_sns_topic.urgent_alert.arn]

#   tags = {
#     Env           = var.env
#     Project       = var.project
#     SecurityLevel = title(var.securitylevel)
#   }
# }

# # ==========================================
# # 10. shotrip-prod-lambda-err-delete-cognitouser
# # ==========================================
# resource "aws_cloudwatch_metric_alarm" "lambda_err_delete_cognitouser" {
#   alarm_name          = "shotrip-prod-lambda-err-delete-cognitouser"
#   comparison_operator = "GreaterThanOrEqualToThreshold"
#   evaluation_periods  = "1"
#   metric_name         = "Errors"
#   namespace           = "AWS/Lambda"
#   period              = "60"
#   statistic           = "Average"
#   threshold           = "1"
#   treat_missing_data  = "missing"

#   dimensions = {
#     FunctionName = aws_lambda_function.delete_cognitouser.function_name
#   }

#   alarm_actions = [aws_sns_topic.urgent_alert.arn]

#   tags = {
#     Env           = var.env
#     Project       = var.project
#     SecurityLevel = title(var.securitylevel)
#   }
# }

# # ==========================================
# # 11. shotrip-prod-lambda-err-lenshistory-archiver
# # ==========================================
# resource "aws_cloudwatch_metric_alarm" "lambda_err_lenshistory_archiver" {
#   alarm_name          = "shotrip-prod-lambda-err-lenshistory-archiver"
#   comparison_operator = "GreaterThanOrEqualToThreshold"
#   evaluation_periods  = "1"
#   metric_name         = "Errors"
#   namespace           = "AWS/Lambda"
#   period              = "60"
#   statistic           = "Average"
#   threshold           = "1"
#   treat_missing_data  = "missing"

#   dimensions = {
#     FunctionName = aws_lambda_function.lenshistory_archiver.function_name
#   }

#   alarm_actions = [aws_sns_topic.urgent_alert.arn]

#   tags = {
#     Env           = var.env
#     Project       = var.project
#     SecurityLevel = title(var.securitylevel)
#   }
# }

# # ==========================================
# # 12. shotrip-prod-lambda-err-rag-otherdata-prep
# # ==========================================
# resource "aws_cloudwatch_metric_alarm" "lambda_err_rag_otherdata_prep" {
#   alarm_name          = "shotrip-prod-lambda-err-rag-otherdata-prep"
#   comparison_operator = "GreaterThanOrEqualToThreshold"
#   evaluation_periods  = "1"
#   metric_name         = "Errors"
#   namespace           = "AWS/Lambda"
#   period              = "60"
#   statistic           = "Average"
#   threshold           = "1"
#   treat_missing_data  = "missing"

#   dimensions = {
#     FunctionName = aws_lambda_function.rag_otherdata_prep.function_name
#   }

#   alarm_actions = [aws_sns_topic.urgent_alert.arn]

#   tags = {
#     Env           = var.env
#     Project       = var.project
#     SecurityLevel = title(var.securitylevel)
#   }
# }

# # ==========================================
# # 13. shotrip-prod-lambda-err-rag-otherdata-processing
# # ==========================================
# resource "aws_cloudwatch_metric_alarm" "lambda_err_rag_otherdata_processing" {
#   alarm_name          = "shotrip-prod-lambda-err-rag-otherdata-processing"
#   comparison_operator = "GreaterThanOrEqualToThreshold"
#   evaluation_periods  = "1"
#   metric_name         = "Errors"
#   namespace           = "AWS/Lambda"
#   period              = "60"
#   statistic           = "Average"
#   threshold           = "1"
#   treat_missing_data  = "missing"

#   dimensions = {
#     FunctionName = aws_lambda_function.rag_otherdata_processing.function_name
#   }

#   alarm_actions = [aws_sns_topic.urgent_alert.arn]

#   tags = {
#     Env           = var.env
#     Project       = var.project
#     SecurityLevel = title(var.securitylevel)
#   }
# }

# # ==========================================
# # 14. shotrip-prod-lambda-err-rag-spot-fav
# # ==========================================
# resource "aws_cloudwatch_metric_alarm" "lambda_err_rag_spot_fav" {
#   alarm_name          = "shotrip-prod-lambda-err-rag-spot-fav"
#   comparison_operator = "GreaterThanOrEqualToThreshold"
#   evaluation_periods  = "1"
#   metric_name         = "Errors"
#   namespace           = "AWS/Lambda"
#   period              = "60"
#   statistic           = "Average"
#   threshold           = "1"
#   treat_missing_data  = "missing"

#   dimensions = {
#     FunctionName = aws_lambda_function.rag_spot_fav.function_name
#   }

#   alarm_actions = [aws_sns_topic.urgent_alert.arn]

#   tags = {
#     Env           = var.env
#     Project       = var.project
#     SecurityLevel = title(var.securitylevel)
#   }
# }

# # ==========================================
# # 15. shotrip-prod-lambda-err-rag-spotdata-prep
# # ==========================================
# resource "aws_cloudwatch_metric_alarm" "lambda_err_rag_spotdata_prep" {
#   alarm_name          = "shotrip-prod-lambda-err-rag-spotdata-prep"
#   comparison_operator = "GreaterThanOrEqualToThreshold"
#   evaluation_periods  = "1"
#   metric_name         = "Errors"
#   namespace           = "AWS/Lambda"
#   period              = "60"
#   statistic           = "Average"
#   threshold           = "1"
#   treat_missing_data  = "missing"

#   dimensions = {
#     FunctionName = aws_lambda_function.rag_spotdata_prep.function_name
#   }

#   alarm_actions = [aws_sns_topic.urgent_alert.arn]

#   tags = {
#     Env           = var.env
#     Project       = var.project
#     SecurityLevel = title(var.securitylevel)
#   }
# }

# # ==========================================
# # 16. shotrip-prod-lambda-err-rag-spotdata-processing
# # ==========================================
# resource "aws_cloudwatch_metric_alarm" "lambda_err_rag_spotdata_processing" {
#   alarm_name          = "shotrip-prod-lambda-err-rag-spotdata-processing"
#   comparison_operator = "GreaterThanOrEqualToThreshold"
#   evaluation_periods  = "1"
#   metric_name         = "Errors"
#   namespace           = "AWS/Lambda"
#   period              = "60"
#   statistic           = "Average"
#   threshold           = "1"
#   treat_missing_data  = "missing"

#   dimensions = {
#     FunctionName = aws_lambda_function.rag_spotdata_processing.function_name
#   }

#   alarm_actions = [aws_sns_topic.urgent_alert.arn]

#   tags = {
#     Env           = var.env
#     Project       = var.project
#     SecurityLevel = title(var.securitylevel)
#   }
# }

# # ==========================================
# # 17. shotrip-prod-lambda-err-delete-dynamodbuser
# # ==========================================
# resource "aws_cloudwatch_metric_alarm" "lambda_err_delete_dynamodbuser" {
#   alarm_name          = "shotrip-prod-lambda-err-delete-dynamodbuser"
#   comparison_operator = "GreaterThanOrEqualToThreshold"
#   evaluation_periods  = "1"
#   metric_name         = "Errors"
#   namespace           = "AWS/Lambda"
#   period              = "60"
#   statistic           = "Average"
#   threshold           = "1"
#   treat_missing_data  = "missing"

#   dimensions = {
#     FunctionName = aws_lambda_function.delete_dynamodbuser.function_name
#   }

#   alarm_actions = [aws_sns_topic.urgent_alert.arn]

#   tags = {
#     Env           = var.env
#     Project       = var.project
#     SecurityLevel = title(var.securitylevel)
#   }
# }

# # ==========================================
# # 18. shotrip-prod-lambda-err-user-registration
# # ==========================================
# resource "aws_cloudwatch_metric_alarm" "lambda_err_user_registration" {
#   alarm_name          = "shotrip-prod-lambda-err-user-registration"
#   comparison_operator = "GreaterThanOrEqualToThreshold"
#   evaluation_periods  = "1"
#   metric_name         = "Errors"
#   namespace           = "AWS/Lambda"
#   period              = "60"
#   statistic           = "Average"
#   threshold           = "1"
#   treat_missing_data  = "missing"

#   dimensions = {
#     FunctionName = aws_lambda_function.user_registration.function_name
#   }

#   alarm_actions = [aws_sns_topic.urgent_alert.arn]

#   tags = {
#     Env           = var.env
#     Project       = var.project
#     SecurityLevel = title(var.securitylevel)
#   }
# }

# # ==========================================
# # 19. shotrip-prod-lambda-err-dynamodbuser-sync
# # ==========================================
# resource "aws_cloudwatch_metric_alarm" "lambda_err_dynamodbuser_sync" {
#   alarm_name          = "shotrip-prod-lambda-err-dynamodbuser-sync"
#   comparison_operator = "GreaterThanOrEqualToThreshold"
#   evaluation_periods  = "1"
#   metric_name         = "Errors"
#   namespace           = "AWS/Lambda"
#   period              = "60"
#   statistic           = "Average"
#   threshold           = "1"
#   treat_missing_data  = "missing"

#   dimensions = {
#     FunctionName = aws_lambda_function.dynamodbuser_sync.function_name
#   }

#   alarm_actions = [aws_sns_topic.urgent_alert.arn]

#   tags = {
#     Env           = var.env
#     Project       = var.project
#     SecurityLevel = title(var.securitylevel)
#   }
# }

# # ==========================================
# # 20. shotrip-prod-lambda-err-dynamodbuser-update
# # ==========================================
# resource "aws_cloudwatch_metric_alarm" "lambda_err_dynamodbuser_update" {
#   alarm_name          = "shotrip-prod-lambda-err-dynamodbuser-update"
#   comparison_operator = "GreaterThanOrEqualToThreshold"
#   evaluation_periods  = "1"
#   metric_name         = "Errors"
#   namespace           = "AWS/Lambda"
#   period              = "60"
#   statistic           = "Average"
#   threshold           = "1"
#   treat_missing_data  = "missing"

#   dimensions = {
#     FunctionName = aws_lambda_function.dynamodbuser_update.function_name
#   }

#   alarm_actions = [aws_sns_topic.urgent_alert.arn]

#   tags = {
#     Env           = var.env
#     Project       = var.project
#     SecurityLevel = title(var.securitylevel)
#   }
# }

# # ==========================================
# # 21. shotrip-prod-lambda-err-lenstoken-scan
# # ==========================================
# resource "aws_cloudwatch_metric_alarm" "lambda_err_lenstoken_scan" {
#   alarm_name          = "shotrip-prod-lambda-err-lenstoken-scan"
#   comparison_operator = "GreaterThanOrEqualToThreshold"
#   evaluation_periods  = "1"
#   metric_name         = "Errors"
#   namespace           = "AWS/Lambda"
#   period              = "60"
#   statistic           = "Average"
#   threshold           = "1"
#   treat_missing_data  = "missing"

#   dimensions = {
#     FunctionName = aws_lambda_function.lenstoken_scan.function_name
#   }

#   alarm_actions = [aws_sns_topic.urgent_alert.arn]

#   tags = {
#     Env           = var.env
#     Project       = var.project
#     SecurityLevel = title(var.securitylevel)
#   }
# }

# # ==========================================
# # 22. shotrip-prod-lambda-err-lenstoken-reset
# # ==========================================
# resource "aws_cloudwatch_metric_alarm" "lambda_err_lenstoken_reset" {
#   alarm_name          = "shotrip-prod-lambda-err-lenstoken-reset"
#   comparison_operator = "GreaterThanOrEqualToThreshold"
#   evaluation_periods  = "1"
#   metric_name         = "Errors"
#   namespace           = "AWS/Lambda"
#   period              = "60"
#   statistic           = "Average"
#   threshold           = "1"
#   treat_missing_data  = "missing"

#   dimensions = {
#     FunctionName = aws_lambda_function.lenstoken_reset.function_name
#   }

#   alarm_actions = [aws_sns_topic.urgent_alert.arn]

#   tags = {
#     Env           = var.env
#     Project       = var.project
#     SecurityLevel = title(var.securitylevel)
#   }
# }

# # ==========================================
# # 23. shotrip-prod-aurora-cpu
# # ==========================================
# resource "aws_cloudwatch_metric_alarm" "aurora_cpu" {
#   alarm_name          = "shotrip-prod-aurora-cpu"
#   comparison_operator = "GreaterThanOrEqualToThreshold"
#   evaluation_periods  = "1"
#   metric_name         = "CPUUtilization"
#   namespace           = "AWS/RDS"
#   period              = "300"
#   statistic           = "Average"
#   threshold           = "80"
#   treat_missing_data  = "missing"

#   dimensions = {
#     DBClusterIdentifier = aws_rds_cluster.main.cluster_identifier
#   }

#   alarm_actions = [aws_sns_topic.urgent_alert.arn]

#   tags = {
#     Env           = var.env
#     Project       = var.project
#     SecurityLevel = title(var.securitylevel)
#   }
# }

# # ==========================================
# # 24. shotrip-prod-aurora-conn
# # ==========================================
# resource "aws_cloudwatch_metric_alarm" "aurora_conn" {
#   alarm_name          = "shotrip-prod-aurora-conn"
#   comparison_operator = "GreaterThanOrEqualToThreshold"
#   evaluation_periods  = "1"
#   metric_name         = "DatabaseConnections"
#   namespace           = "AWS/RDS"
#   period              = "300"
#   statistic           = "Average"
#   threshold           = "720"
#   treat_missing_data  = "missing"

#   dimensions = {
#     DBClusterIdentifier = aws_rds_cluster.main.cluster_identifier
#   }

#   alarm_actions = [aws_sns_topic.urgent_alert.arn]

#   tags = {
#     Env           = var.env
#     Project       = var.project
#     SecurityLevel = title(var.securitylevel)
#   }
# }

# # ==========================================
# # 25. shotrip-prod-ddb-err
# # ==========================================
# resource "aws_cloudwatch_metric_alarm" "ddb_err" {
#   alarm_name          = "shotrip-prod-ddb-err"
#   comparison_operator = "GreaterThanOrEqualToThreshold"
#   evaluation_periods  = "1"
#   metric_name         = "UserErrors"
#   namespace           = "AWS/DynamoDB"
#   period              = "300"
#   statistic           = "Average"
#   threshold           = "1"
#   treat_missing_data  = "missing"

#   dimensions = {
#     TableName = aws_dynamodb_table.lens_table.name
#   }

#   alarm_actions = [aws_sns_topic.urgent_alert.arn]

#   tags = {
#     Env           = var.env
#     Project       = var.project
#     SecurityLevel = title(var.securitylevel)
#   }
# }

# # ==========================================
# # 26. shotrip-prod-sqs-delay-aurorauser-sync
# # ==========================================
# resource "aws_cloudwatch_metric_alarm" "sqs_delay_aurorauser_sync" {
#   alarm_name          = "shotrip-prod-sqs-delay-aurorauser-sync"
#   comparison_operator = "GreaterThanOrEqualToThreshold"
#   evaluation_periods  = "1"
#   metric_name         = "ApproximateNumberOfMessagesVisible"
#   namespace           = "AWS/SQS"
#   period              = "300"
#   statistic           = "Average"
#   threshold           = "100"
#   treat_missing_data  = "missing"

#   dimensions = {
#     QueueName = aws_sqs_queue.aurorauser_sync.name
#   }

#   alarm_actions = [aws_sns_topic.urgent_alert.arn]

#   tags = {
#     Env           = var.env
#     Project       = var.project
#     SecurityLevel = title(var.securitylevel)
#   }
# }

# # ==========================================
# # 27. shotrip-prod-sqs-delay-rag-otherdata-queue
# # ==========================================
# resource "aws_cloudwatch_metric_alarm" "sqs_delay_rag_otherdata" {
#   alarm_name          = "shotrip-prod-sqs-delay-rag-otherdata-queue"
#   comparison_operator = "GreaterThanOrEqualToThreshold"
#   evaluation_periods  = "1"
#   metric_name         = "ApproximateNumberOfMessagesVisible"
#   namespace           = "AWS/SQS"
#   period              = "300"
#   statistic           = "Average"
#   threshold           = "100"
#   treat_missing_data  = "missing"

#   dimensions = {
#     QueueName = aws_sqs_queue.rag_otherdata_queue.name
#   }

#   alarm_actions = [aws_sns_topic.urgent_alert.arn]

#   tags = {
#     Env           = var.env
#     Project       = var.project
#     SecurityLevel = title(var.securitylevel)
#   }
# }

# # ==========================================
# # 28. shotrip-prod-sqs-delay-rag-spotdata-queue
# # ==========================================
# resource "aws_cloudwatch_metric_alarm" "sqs_delay_rag_spotdata" {
#   alarm_name          = "shotrip-prod-sqs-delay-rag-spotdata-queue"
#   comparison_operator = "GreaterThanOrEqualToThreshold"
#   evaluation_periods  = "1"
#   metric_name         = "ApproximateNumberOfMessagesVisible"
#   namespace           = "AWS/SQS"
#   period              = "300"
#   statistic           = "Average"
#   threshold           = "100"
#   treat_missing_data  = "missing"

#   dimensions = {
#     QueueName = aws_sqs_queue.rag_spotdata_queue.name
#   }

#   alarm_actions = [aws_sns_topic.urgent_alert.arn]

#   tags = {
#     Env           = var.env
#     Project       = var.project
#     SecurityLevel = title(var.securitylevel)
#   }
# }

# # ==========================================
# # 29. shotrip-prod-sqs-delay-dynamouser-sync-queue
# # ==========================================
# resource "aws_cloudwatch_metric_alarm" "sqs_delay_dynamouser_sync" {
#   alarm_name          = "shotrip-prod-sqs-delay-dynamouser-sync-queue"
#   comparison_operator = "GreaterThanOrEqualToThreshold"
#   evaluation_periods  = "1"
#   metric_name         = "ApproximateNumberOfMessagesVisible"
#   namespace           = "AWS/SQS"
#   period              = "300"
#   statistic           = "Average"
#   threshold           = "100"
#   treat_missing_data  = "missing"

#   dimensions = {
#     QueueName = aws_sqs_queue.dynamouser_sync.name
#   }

#   alarm_actions = [aws_sns_topic.urgent_alert.arn]

#   tags = {
#     Env           = var.env
#     Project       = var.project
#     SecurityLevel = title(var.securitylevel)
#   }
# }

# # ==========================================
# # 30. shotrip-prod-sqs-delay-lenstoken-reset-queue
# # ==========================================
# resource "aws_cloudwatch_metric_alarm" "sqs_delay_lenstoken_reset" {
#   alarm_name          = "shotrip-prod-sqs-delay-lenstoken-reset-queue"
#   comparison_operator = "GreaterThanOrEqualToThreshold"
#   evaluation_periods  = "1"
#   metric_name         = "ApproximateNumberOfMessagesVisible"
#   namespace           = "AWS/SQS"
#   period              = "300"
#   statistic           = "Average"
#   threshold           = "100"
#   treat_missing_data  = "missing"

#   dimensions = {
#     QueueName = aws_sqs_queue.lenstoken_reset.name
#   }

#   alarm_actions = [aws_sns_topic.urgent_alert.arn]

#   tags = {
#     Env           = var.env
#     Project       = var.project
#     SecurityLevel = title(var.securitylevel)
#   }
# }

# # ==========================================
# # 31. shotrip-prod-sqs-stag-aurorauser-sync-dlq
# # ==========================================
# resource "aws_cloudwatch_metric_alarm" "sqs_dlq_aurorauser_sync" {
#   alarm_name          = "shotrip-prod-sqs-stag-aurorauser-sync-dlq"
#   comparison_operator = "GreaterThanOrEqualToThreshold"
#   evaluation_periods  = "1"
#   metric_name         = "ApproximateNumberOfMessagesVisible"
#   namespace           = "AWS/SQS"
#   period              = "60"
#   statistic           = "Average"
#   threshold           = "1"
#   treat_missing_data  = "missing"

#   dimensions = {
#     QueueName = aws_sqs_queue.aurorauser_sync_dlq.name
#   }

#   alarm_actions = [aws_sns_topic.urgent_alert.arn]

#   tags = {
#     Env           = var.env
#     Project       = var.project
#     SecurityLevel = title(var.securitylevel)
#   }
# }

# # ==========================================
# # 32. shotrip-prod-sqs-stag-rag-otherdata-dlq
# # ==========================================
# resource "aws_cloudwatch_metric_alarm" "sqs_dlq_rag_otherdata" {
#   alarm_name          = "shotrip-prod-sqs-stag-rag-otherdata-dlq"
#   comparison_operator = "GreaterThanOrEqualToThreshold"
#   evaluation_periods  = "1"
#   metric_name         = "ApproximateNumberOfMessagesVisible"
#   namespace           = "AWS/SQS"
#   period              = "60"
#   statistic           = "Average"
#   threshold           = "1"
#   treat_missing_data  = "missing"

#   dimensions = {
#     QueueName = aws_sqs_queue.ragotherdata_dlq.name
#   }

#   alarm_actions = [aws_sns_topic.urgent_alert.arn]

#   tags = {
#     Env           = var.env
#     Project       = var.project
#     SecurityLevel = title(var.securitylevel)
#   }
# }

# # ==========================================
# # 33. shotrip-prod-sqs-stag-rag-spotdata-dlq
# # ==========================================
# resource "aws_cloudwatch_metric_alarm" "sqs_dlq_rag_spotdata" {
#   alarm_name          = "shotrip-prod-sqs-stag-rag-spotdata-dlq"
#   comparison_operator = "GreaterThanOrEqualToThreshold"
#   evaluation_periods  = "1"
#   metric_name         = "ApproximateNumberOfMessagesVisible"
#   namespace           = "AWS/SQS"
#   period              = "60"
#   statistic           = "Average"
#   threshold           = "1"
#   treat_missing_data  = "missing"

#   dimensions = {
#     QueueName = aws_sqs_queue.ragspotdata_dlq.name
#   }

#   alarm_actions = [aws_sns_topic.urgent_alert.arn]

#   tags = {
#     Env           = var.env
#     Project       = var.project
#     SecurityLevel = title(var.securitylevel)
#   }
# }

# # ==========================================
# # 34. shotrip-prod-sqs-stag-dynamouser-sync-dlq
# # ==========================================
# resource "aws_cloudwatch_metric_alarm" "sqs_dlq_dynamouser_sync" {
#   alarm_name          = "shotrip-prod-sqs-stag-dynamouser-sync-dlq"
#   comparison_operator = "GreaterThanOrEqualToThreshold"
#   evaluation_periods  = "1"
#   metric_name         = "ApproximateNumberOfMessagesVisible"
#   namespace           = "AWS/SQS"
#   period              = "60"
#   statistic           = "Average"
#   threshold           = "1"
#   treat_missing_data  = "missing"

#   dimensions = {
#     QueueName = aws_sqs_queue.dynamouser_sync_dlq.name
#   }

#   alarm_actions = [aws_sns_topic.urgent_alert.arn]

#   tags = {
#     Env           = var.env
#     Project       = var.project
#     SecurityLevel = title(var.securitylevel)
#   }
# }

# # ==========================================
# # 35. shotrip-prod-sqs-stag-lenstoken-reset-dlq
# # ==========================================
# resource "aws_cloudwatch_metric_alarm" "sqs_dlq_lenstoken_reset" {
#   alarm_name          = "shotrip-prod-sqs-stag-lenstoken-reset-dlq"
#   comparison_operator = "GreaterThanOrEqualToThreshold"
#   evaluation_periods  = "1"
#   metric_name         = "ApproximateNumberOfMessagesVisible"
#   namespace           = "AWS/SQS"
#   period              = "60"
#   statistic           = "Average"
#   threshold           = "1"
#   treat_missing_data  = "missing"

#   dimensions = {
#     QueueName = aws_sqs_queue.lenstoken_reset_dlq.name
#   }

#   alarm_actions = [aws_sns_topic.urgent_alert.arn]

#   tags = {
#     Env           = var.env
#     Project       = var.project
#     SecurityLevel = title(var.securitylevel)
#   }
# }