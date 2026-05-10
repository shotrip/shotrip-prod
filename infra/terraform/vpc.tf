# # ==========================================
# # VPC
# # ==========================================
# resource "aws_vpc" "main" {
#   cidr_block           = "10.0.0.0/16"
#   instance_tenancy     = "default"
#   enable_dns_support   = true
#   enable_dns_hostnames = true

#   tags = {
#     Name    = "shotrip-prod-vpc"
#     Project = var.project
#     Env     = var.env
#   }
# }


# # ==========================================
# # Subnets
# # ==========================================

# # 1. shotrip-prod-nat-public
# resource "aws_subnet" "nat_public" {
#   vpc_id            = aws_vpc.main.id
#   cidr_block        = "10.0.6.0/24"
#   availability_zone = "ap-northeast-1a"

#   tags = {
#     Name    = "shotrip-prod-nat-public"
#     Project = var.project
#     Env     = var.env
#   }
# }

# resource "aws_route_table_association" "nat_public" {
#   subnet_id      = aws_subnet.nat_public.id
#   route_table_id = aws_route_table.public.id
# }

# # 2. shotrip-prod-bastion-public
# resource "aws_subnet" "bastion_public" {
#   vpc_id            = aws_vpc.main.id
#   cidr_block        = "10.0.2.0/24"
#   availability_zone = "ap-northeast-1a"

#   tags = {
#     Name    = "shotrip-prod-bastion-public"
#     Project = var.project
#     Env     = var.env
#   }
# }

# resource "aws_route_table_association" "bastion_public" {
#   subnet_id      = aws_subnet.bastion_public.id
#   route_table_id = aws_route_table.public.id
# }

# # 3. shotrip-prod-alb-private-01
# resource "aws_subnet" "alb_private_01" {
#   vpc_id            = aws_vpc.main.id
#   cidr_block        = "10.0.5.0/24"
#   availability_zone = "ap-northeast-1a"

#   tags = {
#     Name    = "shotrip-prod-alb-private-01"
#     Project = var.project
#     Env     = var.env
#   }
# }

# resource "aws_route_table_association" "alb_private_01" {
#   subnet_id      = aws_subnet.alb_private_01.id
#   route_table_id = aws_route_table.alb.id
# }

# # 4. shotrip-prod-alb-private-02
# resource "aws_subnet" "alb_private_02" {
#   vpc_id            = aws_vpc.main.id
#   cidr_block        = "10.0.7.0/24"
#   availability_zone = "ap-northeast-1c"

#   tags = {
#     Name    = "shotrip-prod-alb-private-02"
#     Project = var.project
#     Env     = var.env
#   }
# }

# resource "aws_route_table_association" "alb_private_02" {
#   subnet_id      = aws_subnet.alb_private_02.id
#   route_table_id = aws_route_table.alb.id
# }

# # 5. shotrip-prod-fargate-private
# resource "aws_subnet" "fargate_private" {
#   vpc_id            = aws_vpc.main.id
#   cidr_block        = "10.0.3.0/24"
#   availability_zone = "ap-northeast-1a"

#   tags = {
#     Name    = "shotrip-prod-fargate-private"
#     Project = var.project
#     Env     = var.env
#   }
# }

# resource "aws_route_table_association" "fargate_private" {
#   subnet_id      = aws_subnet.fargate_private.id
#   route_table_id = aws_route_table.private.id
# }

# # 6. shotrip-prod-db-private-01
# resource "aws_subnet" "db_private_01" {
#   vpc_id            = aws_vpc.main.id
#   cidr_block        = "10.0.4.0/24"
#   availability_zone = "ap-northeast-1a"

#   tags = {
#     Name    = "shotrip-prod-db-private-01"
#     Project = var.project
#     Env     = var.env
#   }
# }

# resource "aws_route_table_association" "db_private_01" {
#   subnet_id      = aws_subnet.db_private_01.id
#   route_table_id = aws_route_table.db.id
# }

# # 7. shotrip-prod-db-private-02
# resource "aws_subnet" "db_private_02" {
#   vpc_id            = aws_vpc.main.id
#   cidr_block        = "10.0.8.0/24"
#   availability_zone = "ap-northeast-1c"

#   tags = {
#     Name    = "shotrip-prod-db-private-02"
#     Project = var.project
#     Env     = var.env
#   }
# }

# resource "aws_route_table_association" "db_private_02" {
#   subnet_id      = aws_subnet.db_private_02.id
#   route_table_id = aws_route_table.db.id
# }


# # ==========================================
# # Route Tables
# # ==========================================

# # 1. shotrip-prod-route-public
# resource "aws_route_table" "public" {
#   vpc_id = aws_vpc.main.id

#   route {
#     cidr_block = "0.0.0.0/0"
#     gateway_id = aws_internet_gateway.main.id
#   }

#   tags = {
#     Name    = "shotrip-prod-route-public"
#     Project = var.project
#     Env     = var.env
#   }
# }

# # 2. shotrip-prod-route-alb
# resource "aws_route_table" "alb" {
#   vpc_id = aws_vpc.main.id

#   route {
#     cidr_block     = "0.0.0.0/0"
#     nat_gateway_id = aws_nat_gateway.main.id
#   }

#   tags = {
#     Name    = "shotrip-prod-route-alb"
#     Project = var.project
#     Env     = var.env
#   }
# }

# # 3. shotrip-prod-route-private
# resource "aws_route_table" "private" {
#   vpc_id = aws_vpc.main.id

#   route {
#     cidr_block     = "0.0.0.0/0"
#     nat_gateway_id = aws_nat_gateway.main.id
#   }

#   tags = {
#     Name    = "shotrip-prod-route-private"
#     Project = var.project
#     Env     = var.env
#   }
# }

# # 4. shotrip-prod-route-db
# resource "aws_route_table" "db" {
#   vpc_id = aws_vpc.main.id

#   tags = {
#     Name    = "shotrip-prod-route-db"
#     Project = var.project
#     Env     = var.env
#   }
# }


# # ==========================================
# # Internet Gateway
# # ==========================================
# resource "aws_internet_gateway" "main" {
#   vpc_id = aws_vpc.main.id

#   tags = {
#     Name    = "shotrip-prod-igw"
#     Project = var.project
#     Env     = var.env
#   }
# }


# # ==========================================
# # Elastic IP (For NAT Gateway)
# # ==========================================
# resource "aws_eip" "nat" {
#   domain = "vpc"
# }


# # ==========================================
# # NAT Gateway
# # ==========================================
# resource "aws_nat_gateway" "main" {
#   allocation_id = aws_eip.nat.id
#   subnet_id     = aws_subnet.nat_public.id

#   tags = {
#     Name    = "shotrip-prod-nat"
#     Project = var.project
#     Env     = var.env
#   }

#   depends_on = [aws_internet_gateway.main]
# }


# # ==========================================
# # Security Groups
# # ==========================================

# # 1. shotrip-prod-alb-sg
# resource "aws_security_group" "alb" {
#   name        = "shotrip-prod-alb-sg"
#   description = "Allow VPC links to connect with ALB"
#   vpc_id      = aws_vpc.main.id

#   ingress {
#     from_port   = 80
#     to_port     = 80
#     protocol    = "tcp"
#     cidr_blocks = ["10.0.0.0/16"]
#   }

#   egress {
#     from_port   = 0
#     to_port     = 0
#     protocol    = "-1"
#     cidr_blocks = ["0.0.0.0/0"]
#   }

#   tags = {
#     Name    = "shotrip-prod-alb-sg"
#     Project = var.project
#     Env     = var.env
#   }
# }

# # 2. shotrip-prod-bastion-sg
# resource "aws_security_group" "bastion" {
#   name        = "shotrip-prod-bastion-sg"
#   description = "Allow RDP connection"
#   vpc_id      = aws_vpc.main.id

#   ingress {
#     from_port   = 3389
#     to_port     = 3389
#     protocol    = "tcp"
#     cidr_blocks = [var.bastion_allowed_ip]
#   }

#   egress {
#     from_port   = 0
#     to_port     = 0
#     protocol    = "-1"
#     cidr_blocks = ["0.0.0.0/0"]
#   }

#   tags = {
#     Name          = "shotrip-prod-bastion-sg"
#     Project       = var.project
#     Env           = var.env
#     SecurityLevel = "Admin"
#   }
# }

# # 3. shotrip-prod-fargate-sg
# resource "aws_security_group" "fargate" {
#   name        = "shotrip-prod-fargate-sg"
#   description = "Allow ALB connection"
#   vpc_id      = aws_vpc.main.id

#   ingress {
#     from_port       = 8000
#     to_port         = 8000
#     protocol        = "tcp"
#     security_groups = [aws_security_group.alb.id]
#   }

#   egress {
#     from_port   = 0
#     to_port     = 0
#     protocol    = "-1"
#     cidr_blocks = ["0.0.0.0/0"]
#   }

#   tags = {
#     Name    = "shotrip-prod-fargate-sg"
#     Project = var.project
#     Env     = var.env
#   }
# }

# # 4. shotrip-prod-db-sg
# resource "aws_security_group" "db" {
#   name        = "shotrip-prod-db-sg"
#   description = "Allow connection from Fargate"
#   vpc_id      = aws_vpc.main.id

#   ingress {
#     from_port       = 5432
#     to_port         = 5432
#     protocol        = "tcp"
#     security_groups = [aws_security_group.fargate.id]
#   }

#   ingress {
#     from_port       = 3389
#     to_port         = 3389
#     protocol        = "tcp"
#     security_groups = [aws_security_group.bastion.id]
#   }

#   egress {
#     from_port   = 0
#     to_port     = 0
#     protocol    = "-1"
#     cidr_blocks = ["0.0.0.0/0"]
#   }

#   tags = {
#     Name    = "shotrip-prod-db-sg"
#     Project = var.project
#     Env     = var.env
#   }
# }