# # ==========================================
# # ECS Cluster
# # ==========================================
# resource "aws_ecs_cluster" "main" {
#   name = "shotrip-prod"

#   configuration {
#     execute_command_configuration {
#       logging = "DEFAULT"
#     }
#   }

#   tags = {
#     Name    = "shotrip-prod"
#     Project = var.project
#     Env     = var.env
#   }
# }

# resource "aws_ecs_cluster_capacity_providers" "main" {
#   cluster_name = aws_ecs_cluster.main.name

#   capacity_providers = ["FARGATE", "FARGATE_SPOT"]

#   default_capacity_provider_strategy {
#     base              = 0
#     weight            = 1
#     capacity_provider = "FARGATE"
#   }
# }

# # ==========================================
# # ECS Service
# # ==========================================
# resource "aws_ecs_service" "stamp" {
#   name                   = "shotrip-prod-stamp"
#   cluster                = aws_ecs_cluster.main.id
#   task_definition        = aws_ecs_task_definition.stamp.arn
#   desired_count          = 0
#   platform_version       = "1.4.0"
#   enable_execute_command = false
#   health_check_grace_period_seconds = 120

#   capacity_provider_strategy {
#     capacity_provider = "FARGATE"
#     base              = 0
#     weight            = 1
#   }

#   network_configuration {
#     subnets          = [aws_subnet.fargate_private.id]
#     security_groups  = [aws_security_group.fargate.id]
#     assign_public_ip = false
#   }

#   load_balancer {
#     target_group_arn = aws_lb_target_group.fargate.arn
#     container_name   = "stamp"
#     container_port   = 8000
#   }

#   deployment_controller {
#     type = "ECS"
#   }

#   deployment_circuit_breaker {
#     enable   = true
#     rollback = true
#   }

#   deployment_minimum_healthy_percent = 100
#   deployment_maximum_percent         = 200

#   tags = {
#     Name    = "shotrip-prod-stamp"
#     Project = var.project
#     Env     = var.env
#   }

#   lifecycle {
#     ignore_changes = [
#       task_definition,
#       desired_count
#       ]
#   }
# }


# # ==========================================
# # CloudWatch Log Group for ECS
# # ==========================================
# resource "aws_cloudwatch_log_group" "ecs_stamp" {
#   name              = "/ecs/shotrip-prod-stamp"
#   retention_in_days = 3

#   tags = {
#     Name    = "shotrip-prod-stamp-logs"
#     Project = var.project
#     Env     = var.env
#   }
# }