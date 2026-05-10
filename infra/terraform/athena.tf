# # --- Athena Data Catalog ---
# resource "aws_athena_data_catalog" "glue_catalog" {
#   name        = "shotrip-prod-lens-catalog"
#   description = "shotrip-prod-lens-catalog"
#   type        = "GLUE"

#   parameters = {
#     "catalog-id" = var.aws_account_id
#   }
# }

# # --- Athena Workgroup ---
# resource "aws_athena_workgroup" "workgroup" {
#   name = "shotrip-prod-workgroup"

#   configuration {
#     engine_version {
#       selected_engine_version = "Athena engine version 3"
#     }

#     enforce_workgroup_configuration    = true
#     publish_cloudwatch_metrics_enabled = true

#     result_configuration {
#       output_location = "s3://${aws_s3_bucket.lens_analysis.bucket}/athena-results/"

#       encryption_configuration {
#         encryption_option = "SSE_S3"
#       }

#       acl_configuration {
#         s3_acl_option = "BUCKET_OWNER_FULL_CONTROL"
#       }
#     }
#   }

#   state = "ENABLED"

#   tags = {
#     Project = var.project
#     Env = var.env
#     SecurityLevel = title(var.securitylevel)
#   }
# }