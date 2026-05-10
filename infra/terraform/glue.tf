# # --- Glue Database ---
# resource "aws_glue_catalog_database" "lenshistory_db" {
#   name = "shotrip-prod-lenshistory-db"
# }

# # --- Glue Crawler ---
# resource "aws_glue_crawler" "lenshistory_crawler" {
#     name          = "shotrip-prod-lenshistory-crawler"
#     database_name = aws_glue_catalog_database.lenshistory_db.name
#     role          = aws_iam_role.glue_role.arn

#     s3_target {
#     path = "s3://shotrip-prod-lenshistory-analysis/archives/deleted/"
#     }
#     s3_target {
#         path = "s3://shotrip-prod-lenshistory-analysis/archives/expired/"
#     }

#     configuration = jsonencode({
#         Version = 1.0
#         CrawlerOutput = {
#             Partitions = {
#                 AddOrUpdateBehavior = "InheritFromTable"
#             }
#         }
#         Grouping = {
#             TableGroupingPolicy = "CombineCompatibleSchemas"
#         }
#     })

#     schema_change_policy {
#       delete_behavior = "DEPRECATE_IN_DATABASE"
#       update_behavior = "UPDATE_IN_DATABASE"
#     }

#     recrawl_policy {
#       recrawl_behavior = "CRAWL_EVERYTHING"
#     }

#     tags = {
#     Project       = var.project
#     Env           = var.env
#     SecurityLevel = title(var.securitylevel)
#   }
# }