# # --- Common Lifecycle Rule ---
# locals {
#   s3_lifecycle_id = "shotrip-prod-s3-lifecycle"
# }

# # --- shotrip-prod-lens-ragdata-source ---
# resource "aws_s3_bucket" "lens_ragdata_source" {
#   bucket = "shotrip-prod-lens-ragdata-source"
#   tags   = { 
#     Project = var.project
#     Env = var.env
#     SecurityLevel = title(var.securitylevel)
#   }
# }

# resource "aws_s3_bucket_versioning" "lens_ragdata_source" {
#   bucket = aws_s3_bucket.lens_ragdata_source.id
#   versioning_configuration {
#     status = "Enabled"
#   }
# }

# resource "aws_s3_bucket_server_side_encryption_configuration" "lens_ragdata_source" {
#   bucket = aws_s3_bucket.lens_ragdata_source.id
#   rule {
#     apply_server_side_encryption_by_default {
#       sse_algorithm = "AES256"
#     }
#   }
# }

# resource "aws_s3_bucket_lifecycle_configuration" "lens_ragdata_source" {
#   bucket = aws_s3_bucket.lens_ragdata_source.id
#   rule {
#     id = local.s3_lifecycle_id
#     status = "Enabled"
#     noncurrent_version_expiration {
#       noncurrent_days = 1
#       newer_noncurrent_versions = 1
#     }
#   }
# }

# resource "aws_s3_object" "lens_ragdata_source_folders" {
#   for_each = toset(["others/", "spots/"])
#   bucket = aws_s3_bucket.lens_ragdata_source.id
#   key = each.value
#   content = ""
# }


# # --- shotrip-prod-lenshistory-analysis ---
# resource "aws_s3_bucket" "lens_analysis" {
#   bucket = "shotrip-prod-lenshistory-analysis"
#   tags   = { 
#     Project = var.project
#     Env = var.env
#     SecurityLevel = title(var.securitylevel)
#   }
# }

# resource "aws_s3_bucket_versioning" "lens_analysis" {
#   bucket = aws_s3_bucket.lens_analysis.id
#   versioning_configuration { 
#     status = "Enabled"
#   }
# }

# resource "aws_s3_bucket_server_side_encryption_configuration" "lens_analysis" {
#   bucket = aws_s3_bucket.lens_analysis.id
#   rule { 
#     apply_server_side_encryption_by_default { 
#         sse_algorithm = "AES256"
#     }
#   }
# }

# resource "aws_s3_bucket_lifecycle_configuration" "lens_analysis" {
#   bucket = aws_s3_bucket.lens_analysis.id
#   rule {
#     id     = local.s3_lifecycle_id
#     status = "Enabled"
#     noncurrent_version_expiration { 
#         noncurrent_days = 1
#         newer_noncurrent_versions = 1
#     }
#   }
# }


# # --- shotrip-prod-web-hosting ---
# resource "aws_s3_bucket" "web_hosting" {
#   bucket = "shotrip-prod-web-hosting"
#   tags   = { 
#     Project = var.project
#     Env = var.env
#     SecurityLevel = title(var.securitylevel)
#   }
# }

# resource "aws_s3_bucket_versioning" "web_hosting" {
#   bucket = aws_s3_bucket.web_hosting.id
#   versioning_configuration { 
#     status = "Enabled"
#   }
# }

# resource "aws_s3_bucket_server_side_encryption_configuration" "web_hosting" {
#   bucket = aws_s3_bucket.web_hosting.id
#   rule { 
#     apply_server_side_encryption_by_default { 
#         sse_algorithm = "AES256"
#     }
#   }
# }

# resource "aws_s3_bucket_lifecycle_configuration" "web_hosting" {
#   bucket = aws_s3_bucket.web_hosting.id
#   rule {
#     id     = local.s3_lifecycle_id
#     status = "Enabled"
#     noncurrent_version_expiration { 
#         noncurrent_days = 1
#         newer_noncurrent_versions = 1
#     }
#   }
# }

# resource "aws_s3_bucket_policy" "web_hosting_policy" {
#   bucket = aws_s3_bucket.web_hosting.id
#   policy = jsonencode({
#     Version = "2012-10-17"
#     Id      = "PolicyForCloudFrontPrivateContent"
#     Statement = [
#       {
#         Sid    = "AllowCloudFrontServicePrincipal"
#         Effect = "Allow"
#         Principal = { 
#             Service = "cloudfront.amazonaws.com"
#         }
#         Action   = ["s3:GetObject", "s3:ListBucket"]
#         Resource = [aws_s3_bucket.web_hosting.arn, "${aws_s3_bucket.web_hosting.arn}/*"]
#         Condition = {
#           StringEquals = {
#             "AWS:SourceArn" = aws_cloudfront_distribution.main.arn
#           }
#         }
#       },
#       {
#         Sid    = "AllowGitHubActionsRole"
#         Effect = "Allow"
#         Principal = { 
#             AWS = aws_iam_role.github_actions.arn
#         }
#         Action   = ["s3:PutObject", "s3:GetObject", "s3:ListBucket", "s3:DeleteObject"]
#         Resource = [aws_s3_bucket.web_hosting.arn, "${aws_s3_bucket.web_hosting.arn}/*"]
#       }
#     ]
#   })
# }


# # --- shotrip-prod-lens-pics ---
# resource "aws_s3_bucket" "lens_pics" {
#   bucket = "shotrip-prod-lens-pics"
#   tags   = { 
#     Project = var.project
#     Env = var.env
#     SecurityLevel = title(var.securitylevel)
#   }
# }

# resource "aws_s3_bucket_versioning" "lens_pics" {
#   bucket = aws_s3_bucket.lens_pics.id
#   versioning_configuration { 
#     status = "Enabled"
#   }
# }

# resource "aws_s3_bucket_server_side_encryption_configuration" "lens_pics" {
#   bucket = aws_s3_bucket.lens_pics.id
#   rule { 
#     apply_server_side_encryption_by_default { 
#         sse_algorithm = "AES256"
#     }
#   }
# }

# resource "aws_s3_bucket_lifecycle_configuration" "lens_pics" {
#   bucket = aws_s3_bucket.lens_pics.id
#   rule {
#     id     = local.s3_lifecycle_id
#     status = "Enabled"
#     noncurrent_version_expiration { 
#         noncurrent_days = 1
#         newer_noncurrent_versions = 1
#     }
#   }
# }

# resource "aws_s3_object" "lens_pics_folders" {
#   bucket = aws_s3_bucket.lens_pics.id
#   key    = "spots/"
#   content = ""
# }


# # --- shotrip-prod-stamp-pics ---
# resource "aws_s3_bucket" "stamp_pics" {
#   bucket = "shotrip-prod-stamp-pics"
#   tags   = { 
#     Project = var.project
#     Env = var.env
#     SecurityLevel = title(var.securitylevel)
#   }
# }

# resource "aws_s3_bucket_versioning" "stamp_pics" {
#   bucket = aws_s3_bucket.stamp_pics.id
#   versioning_configuration { 
#     status = "Enabled"
#   }
# }

# resource "aws_s3_bucket_server_side_encryption_configuration" "stamp_pics" {
#   bucket = aws_s3_bucket.stamp_pics.id
#   rule { 
#     apply_server_side_encryption_by_default { 
#         sse_algorithm = "AES256"
#     }
#   }
# }

# resource "aws_s3_bucket_lifecycle_configuration" "stamp_pics" {
#   bucket = aws_s3_bucket.stamp_pics.id
#   rule {
#     id     = local.s3_lifecycle_id
#     status = "Enabled"
#     noncurrent_version_expiration { 
#         noncurrent_days = 1
#         newer_noncurrent_versions = 1
#     }
#   }
# }

# resource "aws_s3_object" "stamp_pics_folders" {
#   for_each = toset(["checkpoints/", "routes/", "stamp/"])
#   bucket   = aws_s3_bucket.stamp_pics.id
#   key      = each.value
#   content  = ""
# }



# # ==========================================
# # S3 Event Notification
# # ==========================================
# resource "aws_s3_bucket_notification" "lens_ragdata_source_notification" {
#   bucket = aws_s3_bucket.lens_ragdata_source.id

#   lambda_function {
#     lambda_function_arn = aws_lambda_function.rag_otherdata_prep.arn
#     events              = ["s3:ObjectCreated:*"]
#     filter_prefix       = "others/"
#   }

#   lambda_function {
#     lambda_function_arn = aws_lambda_function.rag_spotdata_prep.arn
#     events              = ["s3:ObjectCreated:*"]
#     filter_prefix       = "spots/"
#   }

#   depends_on = [
#     aws_lambda_permission.s3_invoke_rag_otherdata_prep,
#     aws_lambda_permission.s3_invoke_rag_spotdata_prep
#   ]
# }