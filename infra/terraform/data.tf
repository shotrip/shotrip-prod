# # --- Route 53 (Public Hosted Zone) ---
# data "aws_route53_zone" "main" {
#     name = "shotrip.jp."
#     private_zone = false
# }

# # --- ACM Certificates ---
# # --- For API Gateway ---
# data "aws_acm_certificate" "api" {
#     domain = "api.shotrip.jp"
#     statuses = ["ISSUED"]
# }
# # --- For CloudFront ---
# data "aws_acm_certificate" "www" {
#     provider = aws.virginia
#     domain = "www.shotrip.jp"
#     statuses = ["ISSUED"]
# }
# # --- For Cognito ---
# data "aws_acm_certificate" "auth" {
#     provider = aws.virginia
#     domain = "auth.shotrip.jp"
#     statuses = ["ISSUED"]
# }

# # --- AWS Account & Region Context ---
# data "aws_caller_identity" "current" {}
# data "aws_region" "current" {}

# # --- IAM Admin User ---
# data "aws_iam_user" "admin" {
#   user_name = "shotrip-prod-admin"
# }

# # --- Dummy Archive for Zip-based Lambdas ---
# data "archive_file" "dummy" {
#   type        = "zip"
#   output_path = "${path.module}/dummy_payload.zip"
#   source {
#     content  = "def handler(event, context): pass"
#     filename = "index.py"
#   }
# }

# # --- AMI for Bastion EC2 ---
# data "aws_ami" "windows_2025" {
#   most_recent = true
#   owners      = ["amazon"]

#   filter {
#     name   = "name"
#     values = ["Windows_Server-2025-English-Full-Base-*"]
#   }
# }