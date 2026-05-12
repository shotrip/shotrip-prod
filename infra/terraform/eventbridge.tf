# --- EventBridge Rules ---
resource "aws_cloudwatch_event_rule" "aurorauser_sync" {
  name = "shotrip-prod-aurorauser-sync"
  event_bus_name = "default"
  state = "ENABLED"

  event_pattern = jsonencode({
    "source" : ["custom.shotrip.user_registration"],
    "detail-type" : ["UserRegistration"]
  })

  tags   = { 
    Project = var.project
    Env = var.env
    SecurityLevel = title(var.securitylevel)
  }
}

resource "aws_cloudwatch_event_target" "aurorauser_sync_target" {
  rule      = aws_cloudwatch_event_rule.aurorauser_sync.name
  target_id = aws_sqs_queue.aurorauser_sync.name
  arn       = aws_sqs_queue.aurorauser_sync.arn
  role_arn  = aws_iam_role.eventbridge_role.arn
}


resource "aws_cloudwatch_event_rule" "dynamodbuser_sync" {
  name           = "shotrip-prod-dynamodbuser-sync"
  event_bus_name = "default"
  state = "ENABLED"
  
  event_pattern = jsonencode({
    "source" : ["custom.shotrip.user_registration"],
    "detail-type" : ["UserRegistration"]
  })

  tags   = { 
    Project = var.project
    Env = var.env
    SecurityLevel = title(var.securitylevel)
  }
}

resource "aws_cloudwatch_event_target" "dynamouser_sync_target" {
  rule      = aws_cloudwatch_event_rule.dynamodbuser_sync.name
  target_id = aws_sqs_queue.dynamouser_sync.name
  arn       = aws_sqs_queue.dynamouser_sync.arn
  role_arn  = aws_iam_role.eventbridge_role.arn
}

# --- EventBridge Scheduler ---
resource "aws_scheduler_schedule" "lenstoken_reset" {
  name       = "shotrip-prod-lenstoken-reset-event"
  group_name = "default"
  state      = "ENABLED"

  schedule_expression          = "cron(0 0 ? * SUN *)"
  schedule_expression_timezone = "Asia/Tokyo"

  flexible_time_window {
    mode = "OFF"
  }

  target {
    arn      = aws_lambda_function.lenstoken_scan.arn
    role_arn = aws_iam_role.eventbridge_role.arn
  }
}