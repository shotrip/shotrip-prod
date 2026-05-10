# # ---ECR name definitions ---
# locals {
#   ecr_repositories = [
#     "shotrip-prod/shotrip-prod-aurorauser-sync",
#     "shotrip-prod/shotrip-prod-chatbot-api",
#     "shotrip-prod/shotrip-prod-chatbot-payment",
#     "shotrip-prod/shotrip-prod-rag-spotdata-processing",
#     "shotrip-prod/shotrip-prod-rag-otherdata-processing",
#     "shotrip-prod/shotrip-prod-rag-spot-fav",
#     "shotrip-prod/shotrip-prod-stamp"
#   ]
# }

# # --- ECR repositories ---
# resource "aws_ecr_repository" "repos" {
#   for_each = toset(local.ecr_repositories)
#   name = each.value
#   image_tag_mutability = "MUTABLE"

#   encryption_configuration {
#     encryption_type = "KMS"
#     kms_key = "alias/aws/ecr"
#   }

#   image_scanning_configuration {
#     scan_on_push = true
#   }

#   tags = {
#     Project       = var.project
#     Env           = var.env
#     SecurityLevel = title(var.securitylevel)
#   }

#   lifecycle {
#     prevent_destroy = true
#     ignore_changes = all 
#   }
# }

# resource "aws_ecr_repository_policy" "lambda_access" {
#   for_each = {
#     for k, v in aws_ecr_repository.repos : k => v
#     if k != "shotrip-prod/shotrip-prod-stamp"
#   }
#   repository = each.value.name

#   policy = jsonencode({
#     Version = "2012-10-17"
#     Statement = [
#         {
#             Sid = "LambdaECRImageRetrievalPolicy"
#             Effect = "Allow"
#             Principal = {
#                 Service = "lambda.amazonaws.com"
#             }
#             Action = [
#                 "ecr:BatchGetImage",
#                 "ecr:GetDownloadUrlForLayer",
#                 "ecr:SetRepositoryPolicy",
#                 "ecr:DeleteRepositoryPolicy",
#                 "ecr:GetRepositoryPolicy"
#             ]
#             Condition = {
#                 StringLike = {
#                     "aws:sourceArn": "arn:aws:lambda:ap-northeast-1:${data.aws_caller_identity.current.account_id}:function:*"
#                 }
#             }
#         }
#     ]
#   })
# }

# resource "null_resource" "push_dummy_image" {
#   for_each = aws_ecr_repository.repos

#   depends_on = [aws_ecr_repository.repos]

#   triggers = {
#     repository_url = each.value.repository_url
#   }

#   provisioner "local-exec" {
#     command = <<EOF
#       aws ecr get-login-password --region ${data.aws_region.current.region} | docker login --username AWS --password-stdin ${data.aws_caller_identity.current.account_id}.dkr.ecr.${data.aws_region.current.region}.amazonaws.com
      
#       docker pull alpine:latest
#       docker tag alpine:latest ${each.value.repository_url}:latest
#       docker push ${each.value.repository_url}:latest
#     EOF
#   }
# }