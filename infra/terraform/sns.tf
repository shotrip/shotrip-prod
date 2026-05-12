# --- SNS topics ---
# --- Tokyo ---
resource "aws_sns_topic" "aurora_notification" {
  name = "shotrip-prod-aurora-system-notification"
  tags = {
    Project       = var.project
    Env           = var.env
    SecurityLevel = var.securitylevel
  }
}

resource "aws_sns_topic" "urgent_alert" {
  name = "shotrip-prod-urgent-alert"
  tags = {
    Project       = var.project
    Env           = var.env
    SecurityLevel = var.securitylevel
  }
}

# --- Virginia ---
resource "aws_sns_topic" "urgent_alert_global" {
  provider = aws.virginia
  name = "shotrip-prod-urgent-alert-global"
  tags = {
    Project       = var.project
    Env           = var.env
    SecurityLevel = var.securitylevel
  }
}

# --- SNS Subscriptions ---
resource "aws_sns_topic_subscription" "aurora_email" {
  topic_arn = aws_sns_topic.aurora_notification.arn
  protocol = "email"
  endpoint = "alarm@shotrip.jp"
}

resource "aws_sns_topic_subscription" "urgent_email" {
  topic_arn = aws_sns_topic.urgent_alert.arn
  protocol = "email"
  endpoint = "alarm@shotrip.jp"
}

resource "aws_sns_topic_subscription" "urgent_global_email" {
  provider = aws.virginia
  topic_arn = aws_sns_topic.urgent_alert_global.arn
  protocol = "email"
  endpoint = "alarm@shotrip.jp"
}

# --- SNS Topic Policies ---
# --- Aurora System Notification Policy ---
resource "aws_sns_topic_policy" "aurora_notification_policy" {
  arn = aws_sns_topic.aurora_notification.arn
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "Allow_Publish_Alarms"
        Effect = "Allow"
        Principal = { Service = "rds.amazonaws.com" }
        Action   = "sns:Publish"
        Resource = aws_sns_topic.aurora_notification.arn
      },
      {
        Sid    = "Default_Statement"
        Effect = "Allow"
        Principal = { AWS = "*" }
        Action = ["SNS:Publish", "SNS:RemovePermission", "SNS:SetTopicAttributes", "SNS:DeleteTopic", "SNS:ListSubscriptionsByTopic", "SNS:GetTopicAttributes", "SNS:AddPermission", "SNS:Subscribe"]
        Resource = aws_sns_topic.aurora_notification.arn
        Condition = {
          StringEquals = { "AWS:SourceAccount" = data.aws_caller_identity.current.account_id }
        }
      }
    ]
  })
}

# --- Urgent Alert Policy ---
resource "aws_sns_topic_policy" "urgent_alert_policy" {
  arn = aws_sns_topic.urgent_alert.arn
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "Allow_Publish_Alarms"
        Effect = "Allow"
        Principal = { Service = "cloudwatch.amazonaws.com" }
        Action   = "sns:Publish"
        Resource = aws_sns_topic.urgent_alert.arn
      },
      {
        Sid    = "Allow_Publish_Events"
        Effect = "Allow"
        Principal = { Service = "events.amazonaws.com" }
        Action   = "sns:Publish"
        Resource = aws_sns_topic.urgent_alert.arn
      },
      {
        Sid    = "Default_Statement"
        Effect = "Allow"
        Principal = { AWS = "*" }
        Action = ["SNS:Publish", "SNS:RemovePermission", "SNS:SetTopicAttributes", "SNS:DeleteTopic", "SNS:ListSubscriptionsByTopic", "SNS:GetTopicAttributes", "SNS:AddPermission", "SNS:Subscribe"]
        Resource = aws_sns_topic.urgent_alert.arn
        Condition = {
          StringEquals = { "AWS:SourceAccount" = data.aws_caller_identity.current.account_id }
        }
      }
    ]
  })
}

# --- Urgent Alert Global Policy ---
resource "aws_sns_topic_policy" "urgent_alert_global_policy" {
  provider = aws.virginia
  arn      = aws_sns_topic.urgent_alert_global.arn
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "Allow_Publish_Alarms"
        Effect = "Allow"
        Principal = { Service = "cloudwatch.amazonaws.com" }
        Action   = "sns:Publish"
        Resource = aws_sns_topic.urgent_alert_global.arn
      },
      {
        Sid    = "Default_Statement"
        Effect = "Allow"
        Principal = { AWS = "*" }
        Action = ["SNS:Publish", "SNS:RemovePermission", "SNS:SetTopicAttributes", "SNS:DeleteTopic", "SNS:ListSubscriptionsByTopic", "SNS:GetTopicAttributes", "SNS:AddPermission", "SNS:Subscribe"]
        Resource = aws_sns_topic.urgent_alert_global.arn
        Condition = {
          StringEquals = { "AWS:SourceAccount" = data.aws_caller_identity.current.account_id }
        }
      }
    ]
  })
}