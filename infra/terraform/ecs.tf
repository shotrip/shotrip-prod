# ==========================================
# ECS Cluster
# ==========================================
resource "aws_ecs_cluster" "main" {
  name = "shotrip-prod"

  configuration {
    execute_command_configuration {
      logging = "DEFAULT"
    }
  }

  tags = {
    Name    = "shotrip-prod"
    Project = var.project
    Env     = var.env
  }
}

resource "aws_ecs_cluster_capacity_providers" "main" {
  cluster_name = aws_ecs_cluster.main.name

  capacity_providers = ["FARGATE", "FARGATE_SPOT"]

  default_capacity_provider_strategy {
    base              = 0
    weight            = 1
    capacity_provider = "FARGATE"
  }
}

# ==========================================
# ECS Service
# ==========================================
resource "aws_ecs_service" "stamp" {
  name                   = "shotrip-prod-stamp"
  cluster                = aws_ecs_cluster.main.id
  task_definition        = aws_ecs_task_definition.stamp.arn
  desired_count          = 0
  platform_version       = "1.4.0"
  enable_execute_command = false

  capacity_provider_strategy {
    capacity_provider = "FARGATE"
    base              = 0
    weight            = 1
  }

  network_configuration {
    subnets          = [aws_subnet.fargate_private.id]
    security_groups  = [aws_security_group.fargate.id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.fargate.arn
    container_name   = "stamp"
    container_port   = 8000
  }

  deployment_controller {
    type = "ECS"
  }

  deployment_circuit_breaker {
    enable   = true
    rollback = true
  }

  deployment_minimum_healthy_percent = 100
  deployment_maximum_percent         = 200

  tags = {
    Name    = "shotrip-prod-stamp"
    Project = var.project
    Env     = var.env
  }

  lifecycle {
    ignore_changes = [
      task_definition,
      desired_count
      ]
  }
}


# ==========================================
# CloudWatch Log Group for ECS
# ==========================================
resource "aws_cloudwatch_log_group" "ecs_stamp" {
  name              = "/ecs/shotrip-prod-stamp"
  retention_in_days = 3

  tags = {
    Name    = "shotrip-prod-stamp-logs"
    Project = var.project
    Env     = var.env
  }
}


# ==========================================
# ECS Task Definition
# ==========================================
resource "aws_ecs_task_definition" "stamp" {
  family                   = "shotrip-prod-stamp"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "1024"
  memory                   = "2048"
  
  execution_role_arn       = aws_iam_role.ecs_exec_role.arn
  task_role_arn            = aws_iam_role.ecs_task_role.arn

  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "X86_64"
  }

  container_definitions = jsonencode([
    {
      name      = "stamp"
      image     = "${aws_ecr_repository.repos["shotrip-prod/shotrip-prod-stamp"].repository_url}:latest"
      essential = true
      
      portMappings = [
        {
          containerPort = 8000
          hostPort      = 8000
          protocol      = "tcp"
        }
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.ecs_stamp.name
          "awslogs-region"        = "ap-northeast-1"
          "awslogs-stream-prefix" = "ecs"
        }
      }

      environment = [
        { name = "AWS_REGION",  value = "ap-northeast-1" },
        { name = "BUCKET_NAME", value = aws_s3_bucket.stamp_pics.bucket},
        { name = "DB_HOST",     value = aws_rds_cluster.main.endpoint },
        { name = "DB_NAME",     value = "postgres" },
        { name = "DB_PORT",     value = tostring(aws_rds_cluster.main.port) },
        { name = "DB_USER",     value = "shotrip-prod-stamp" },
        { name = "SSLMODE",     value = "verify-full" },
        { name = "SSLROOTCERT", value = "/root/.postgresql/root.crt" }
      ]
    }
  ])

  tags = {
    Name    = "shotrip-prod-stamp"
    Project = var.project
    Env     = var.env
  }
}