# ==========================================
# Application Load Balancer
# ==========================================
resource "aws_lb" "main" {
  name               = "shotrip-prod-alb"
  internal           = true
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  
  subnets = [
    aws_subnet.alb_private_01.id,
    aws_subnet.alb_private_02.id
  ]

  tags = {
    Name    = "shotrip-prod-alb"
    Project = var.project
    Env     = var.env
  }
}


# ==========================================
# Target Group
# ==========================================
resource "aws_lb_target_group" "fargate" {
  name        = "shotrip-prod-fargate-target"
  port        = 8080
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "ip"

  health_check {
    protocol            = "HTTP"
    path                = "/health"
    port                = "traffic-port"
    healthy_threshold   = 5
    unhealthy_threshold = 2
    timeout             = 5
    interval            = 30
    matcher             = "200"
  }

  tags = {
    Name    = "shotrip-prod-fargate-target"
    Project = var.project
    Env     = var.env
  }
}


# ==========================================
# Listener
# ==========================================
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.main.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.fargate.arn
  }
}