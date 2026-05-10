# ==========================================
# Aurora PostgreSQL Subnet Group
# ==========================================
resource "aws_db_subnet_group" "aurora" {
  name        = "shotrip-prod-aurora-subnetgroup"
  description = "Group of subnet for Aurora"
  
  subnet_ids  = [
    aws_subnet.db_private_01.id,
    aws_subnet.db_private_02.id
  ]

  tags = {
    Project = var.project
    Env     = var.env
  }
}

# ==========================================
# Aurora PostgreSQL Cluster
# ==========================================
resource "aws_rds_cluster" "main" {
  cluster_identifier                  = "shotrip-prod"
  engine                              = "aurora-postgresql"
  engine_version                      = "17.4"
  database_name                       = "postgres"
  master_username                     = "shotrip"

  manage_master_user_password         = true
  
  port                                = 5432
  db_subnet_group_name                = aws_db_subnet_group.aurora.name
  vpc_security_group_ids              = [aws_security_group.db.id]

  db_cluster_parameter_group_name     = "default.aurora-postgresql17"
  
  storage_encrypted                   = true
  iam_database_authentication_enabled = true
  deletion_protection                 = true

  backup_retention_period             = 7
  preferred_backup_window             = "18:00-18:30"
  preferred_maintenance_window        = "sat:19:00-sat:19:30"
  copy_tags_to_snapshot               = true

  enabled_cloudwatch_logs_exports     = ["postgresql"]

  lifecycle {
    ignore_changes = [master_password]
  }

  tags = {
    Name    = "shotrip-prod"
    Project = var.project
    Env     = var.env
  }
}

# ==========================================
# Aurora PostgreSQL Instance
# ==========================================
resource "aws_rds_cluster_instance" "main" {
  identifier                   = "shotrip-prod-instance-1"
  cluster_identifier           = aws_rds_cluster.main.id
  instance_class               = "db.t3.medium"
  engine                       = aws_rds_cluster.main.engine
  engine_version               = aws_rds_cluster.main.engine_version
  
  db_subnet_group_name         = aws_db_subnet_group.aurora.name
  db_parameter_group_name      = "default.aurora-postgresql17"
  
  auto_minor_version_upgrade   = false
  preferred_maintenance_window = "sat:19:30-sat:20:00"

  performance_insights_enabled          = true
  performance_insights_retention_period = 7
  
  monitoring_interval = 60
  monitoring_role_arn = "arn:aws:iam::${var.aws_account_id}:role/${aws_iam_role.rds_monitorting_role.name}"

  tags = {
    Name    = "shotrip-prod-instance-1"
    Project = var.project
    Env     = var.env
  }
}

# ==========================================
# Aurora Event Subscription
# ==========================================
resource "aws_db_event_subscription" "aurora_notification" {
  name             = "shotrip-prod-aurora-system-notification"
  
  sns_topic        = aws_sns_topic.aurora_notification.arn
  
  source_type      = "db-cluster"
  source_ids       = [aws_rds_cluster.main.id]
  enabled          = true

  tags = {
    Project = var.project
    Env     = var.env
  }
}