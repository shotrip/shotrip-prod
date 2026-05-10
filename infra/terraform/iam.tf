# # --- Custom Policies ---
# resource "aws_iam_policy" "common_logging" {
#   name = "shotrip-prod-common-logging-policy"
#   description = "Policy for CloudWatch logs access"
#   policy = jsonencode({
#     Version = "2012-10-17"
#     Statement = [{
#         Sid = "CloudWatchLogsAccess"
#         Effect = "Allow"
#         Action = [
#             "logs:CreateLog Group",
#             "logs:CreateLogStream",
#             "logs:PutLogEvents"
#         ]
#         Resource = "arn:aws:logs:ap-northeast-1:${var.aws_account_id}:log-group:/shotrip/prod/*"
#     }]
#   })
# }

# resource "aws_iam_policy" "data_access" {
#   name = "shotrip-prod-data-access-policy"
#   description = "Policy for S3, DynamoDB, SQS and Aurora access"
#   policy = jsonencode({
#     Version = "2012-10-17"
#     Statement = [
#       {
#         Sid = "S3Access"
#         Effect = "Allow"
#         Action = [
#             "s3:GetObject",
#             "s3:PutObject",
#             "s3:DeleteObject",
#             "s3:ListBucket"
#         ]
#         Resource = [
#             "arn:aws:s3:::shotrip-prod-*",
#             "arn:aws:s3:::shotrip-prod-*/*"
#         ]
#       },
#       {
#         Sid      = "DynamoDBAccess"
#         Effect   = "Allow"
#         Action   = [
#             "dynamodb:GetItem",
#             "dynamodb:PutItem",
#             "dynamodb:UpdateItem",
#             "dynamodb:DeleteItem",
#             "dynamodb:Query",
#             "dynamodb:Scan",
#             "dynamodb:BatchWriteItem",
#             "dynamodb:DescribeTable"
#         ]
#         Resource = "arn:aws:dynamodb:ap-northeast-1:${var.aws_account_id}:table/shotrip-prod-*"
#       },
#       {
#         Sid      = "DynamoDBStreamAccess"
#         Effect   = "Allow"
#         Action   = [
#             "dynamodb:GetRecords",
#             "dynamodb:GetShardIterator",
#             "dynamodb:DescribeStream",
#             "dynamodb:ListStreams"
#         ]
#         Resource = "arn:aws:dynamodb:ap-northeast-1:${var.aws_account_id}:table/shotrip-prod-*/stream/*"
#       },
#       {
#         Sid      = "SQSAccess"
#         Effect   = "Allow"
#         Action   = [
#             "sqs:SendMessage",
#             "sqs:ReceiveMessage",
#             "sqs:DeleteMessage",
#             "sqs:GetQueueAttributes"
#         ]
#         Resource = "arn:aws:sqs:ap-northeast-1:${var.aws_account_id}:shotrip-prod-*"
#       },
#       {
#         Sid      = "AuroraIAMAuth"
#         Effect   = "Allow"
#         Action   = "rds-db:connect"
#         Resource = "arn:aws:rds-db:ap-northeast-1:${var.aws_account_id}:dbuser:*/*"
#       }
#     ]
#   })
# }

# resource "aws_iam_policy" "identity_access" {
#   name        = "shotrip-prod-identity-access-policy"
#   policy      = jsonencode({
#     Version   = "2012-10-17"
#     Statement = [{
#       Sid      = "CognitoAdminActions"
#       Effect   = "Allow"
#       Action   = [
#         "cognito-idp:AdminGetUser",
#         "cognito-idp:AdminUpdateUserAttributes",
#         "cognito-idp:AdminCreateUser",
#         "cognito-idp:AdminDeleteUser",
#         "cognito-idp:ListUsers",
#         "cognito-idp:AdminSetUserPassword"
#       ]
#       Resource = "arn:aws:cognito-idp:ap-northeast-1:${var.aws_account_id}:userpool/*"
#     }]
#   })
# }

# resource "aws_iam_policy" "config_access" {
#   name = "shotrip-prod-config-access-policy"
#   policy = jsonencode({
#     "Version" : "2012-10-17",
#     "Statement" : [
#       {
#         "Sid" : "SSMParameterRead",
#         "Effect" : "Allow",
#         "Action" : [
#             "ssm:GetParameter",
#             "ssm:GetParameters",
#             "ssm:GetParametersByPath"
#         ],
#         "Resource" : "arn:aws:ssm:ap-northeast-1:${var.aws_account_id}:parameter/shotrip/prod/*"
#       }
#     ]
#   })
# }

# resource "aws_iam_policy" "eventbridge_invoke" {
#   name = "shotrip-prod-eventbridge-invoke-policy"
#   policy = jsonencode({
#     "Version" : "2012-10-17",
#     "Statement" : [
#       {
#         "Sid" : "InvokeLambda",
#         "Effect" : "Allow",
#         "Action" : "lambda:InvokeFunction",
#         "Resource" : "arn:aws:lambda:ap-northeast-1:${var.aws_account_id}:function:shotrip-prod-*"
#       },
#       {
#         "Sid" : "SendMessageToSQS",
#         "Effect" : "Allow",
#         "Action" : "sqs:SendMessage",
#         "Resource" : "arn:aws:sqs:ap-northeast-1:${var.aws_account_id}:shotrip-prod-*"
#       }
#     ]
#   })
# }



# # --- IAM Roles ---
# resource "aws_iam_role" "glue_role" {
#   name = "shotrip-prod-glue-role"
#   assume_role_policy = jsonencode({
#     "Version" : "2012-10-17",
#     "Statement" : [{
#         "Effect" : "Allow",
#         "Principal" : {"Service" : "glue.amazonaws.com"},
#         "Action" : "sts:AssumeRole"
#     }]
#   })
#   tags = {
#     Project = var.project
#     Env = var.env
#     SecurityLevel = title(var.securitylevel)
#   }
# }

# resource "aws_iam_role" "eventbridge_role" {
#   name = "shotrip-prod-eventbridge-role"
#   assume_role_policy = jsonencode({
#     "Version" : "2012-10-17",
#     "Statement" : [{
#       "Effect" : "Allow",
#       "Principal" : {
#         "Service" : [
#             "events.amazonaws.com",
#             "scheduler.amazonaws.com"
#         ]
#        },
#       "Action" : "sts:AssumeRole"
#     }]
#   })
#   tags = {
#     Project = var.project
#     Env = var.env
#     SecurityLevel = title(var.securitylevel)
#   }
# }

# resource "aws_iam_role" "backend_role" {
#   name = "shotrip-prod-backend-role"
#   assume_role_policy = jsonencode({
#     "Version" : "2012-10-17",
#     "Statement" : [{
#         "Effect" : "Allow"
#         "Principal" : { "Service" : "lambda.amazonaws.com" },
#         "Action" : "sts:AssumeRole"
#     }]
#   })
#   tags = {
#     Project = var.project
#     Env = var.env
#     SecurityLevel = title(var.securitylevel)
#   }
# }

# resource "aws_iam_role" "ecs_task_role" {
#   name = "shotrip-prod-ecs-task-role"
#   assume_role_policy = jsonencode({
#     "Version" : "2012-10-17",
#     "Statement" : [{
#         "Effect" : "Allow",
#         "Principal" : { "Service" : "ecs-tasks.amazonaws.com" },
#         "Action" : "sts:AssumeRole"
#     }]
#   })
#   tags = {
#     Project = var.project
#     Env = var.env
#     SecurityLevel = title(var.securitylevel)
#   }
# }

# resource "aws_iam_role" "ecs_exec_role" {
#   name = "shotrip-prod-ecs-exec-role"
#   assume_role_policy = jsonencode({
#     "Version" : "2012-10-17",
#     "Statement" : [{
#         "Effect" : "Allow",
#         "Principal" : { "Service" : "ecs-tasks.amazonaws.com" },
#         "Action" : "sts:AssumeRole"
#     }]
#   })
#   tags = {
#     Project = var.project
#     Env = var.env
#     SecurityLevel = title(var.securitylevel)
#   }
# }

# resource "aws_iam_role" "rds_monitorting_role" {
#   name = "shotrip-prod-rds-monitoring-role"
#   assume_role_policy = jsonencode({
#     "Version" : "2012-10-17",
#     "Statement" : [{
#         "Effect" : "Allow",
#         "Principal" : { "Service" : "monitoring.rds.amazonaws.com" },
#         "Action" : "sts:AssumeRole"
#     }]
#   })
#   tags = {
#     Project = var.project
#     Env = var.env
#     SecurityLevel = title(var.securitylevel)
#   }
# }


# # --- Policy Attachments ---
# resource "aws_iam_role_policy_attachment" "glue_attach" {
#   for_each   = toset([
#     "arn:aws:iam::aws:policy/AmazonS3FullAccess",
#     "arn:aws:iam::aws:policy/service-role/AWSGlueServiceRole"
#   ])
#   role       = aws_iam_role.glue_role.name
#   policy_arn = each.value
# }

# resource "aws_iam_role_policy_attachment" "eb_attach" {
#   role       = aws_iam_role.eventbridge_role.name
#   policy_arn = aws_iam_policy.eventbridge_invoke.arn
# }

# resource "aws_iam_role_policy_attachment" "backend_attach" {
#   for_each = {
#     common = aws_iam_policy.common_logging.arn
#     data = aws_iam_policy.data_access.arn
#     identity = aws_iam_policy.identity_access.arn
#     config = aws_iam_policy.config_access.arn
#     vpc_lambda = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
#   }
#   role       = aws_iam_role.backend_role.name
#   policy_arn = each.value
# }

# resource "aws_iam_role_policy_attachment" "ecs_task_attach" {
#   for_each = {
#     common = aws_iam_policy.common_logging.arn
#     data = aws_iam_policy.data_access.arn
#     identity = aws_iam_policy.identity_access.arn
#     config = aws_iam_policy.config_access.arn
#   }
#   role       = aws_iam_role.ecs_task_role.name
#   policy_arn = each.value
# }

# resource "aws_iam_role_policy_attachment" "ecs_exec_attach" {
#   for_each = {
#     common = aws_iam_policy.common_logging.arn
#     ecs_task_exec = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
#   }
#   role       = aws_iam_role.ecs_exec_role.name
#   policy_arn = each.value
# }

# resource "aws_iam_role_policy_attachment" "rds_monitoring_attach" {
#   role = aws_iam_role.rds_monitorting_role.name
#   policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonRDSEnhancedMonitoringRole"
# }