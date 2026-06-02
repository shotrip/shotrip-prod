# ==========================================
# Bastion EC2 Instance
# ==========================================
resource "aws_instance" "bastion" {
  ami           = data.aws_ami.windows_2025.id
  instance_type = "t3.medium"

  subnet_id                   = aws_subnet.bastion_public.id
  vpc_security_group_ids      = [aws_security_group.bastion.id]
  associate_public_ip_address = true
  
  key_name = aws_key_pair.bastion.key_name
  monitoring = false

  credit_specification {
    cpu_credits = "standard"
  }

  root_block_device {
    volume_size           = 30
    volume_type           = "gp3"
    iops                  = 3000
    throughput            = 125
    delete_on_termination = true
  }

  tags = {
    Name          = "shotrip-prod-bastion"
    Project       = var.project
    Env           = var.env
    SecurityLevel = title(var.securitylevel)
  }
}

#
resource "aws_key_pair" "bastion" {
  key_name   = "shotrip-prod-bastion-key"
  public_key = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDhLGcXTJDqjIei5SQ5eHswG2wAT5mJlt3srQZgh3mbvBqvYEVcQEcM28XDgxDe7OBLJXulggLL/S9KkxtNerKhcdogwY5qOgIuDmgPdFO8fRqqmzRuG5sl6umJU+txrTwnqtiIIJfJWCLge4CzlLciE9JBhdTgw1QcCRne/aOidJkiKCydUVJ4lrJNdakxvyn3hG+23vRh4KL22KLfo9dqJfMBcqmYo7ZM2ZGDFj46cCHLPAa6tFIrNpJ4S80izqiV0RlreeXIA3FiVq1lMoZu1lGFDp8mRcM5fVTB+kNsOV3sz8jUunXepaC0LsjeCX/p3eG0EZYlp/PHFap/dXwL shotrip-prod-bastion-key" 
  region     = "ap-northeast-1"
}

import {
  to = aws_key_pair.bastion
  id = "shotrip-prod-bastion-key"
}