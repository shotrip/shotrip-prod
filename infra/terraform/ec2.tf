# ==========================================
# Bastion EC2 Instance
# ==========================================
resource "aws_instance" "bastion" {
  ami           = data.aws_ami.windows_2025.id
  instance_type = "t3.micro"

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

resource "aws_key_pair" "bastion" {
  key_name   = "shotrip-prod-bastion-key"
  public_key = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDVpboB5SBInbgg6OF4cNu8VkvyU/Gan3XNqczUb8T9cmDewzftMfSv1o5Xz/zR5l66QNM5ZYm152/1KruYzh1WmTOHIAUXrslWYQdZTMCKl01nAzgD6O8U2CBMINuDHb6eK12a1ujFF3a/QLNbxljQux7xjoa2Lcc22yzQ3rH6+jrq4Cl+GjYc4Jj5Q1OWxbZbIWl9pztOZ7OL46xOs5LoVphHEaNpnj5IKSeBzcOospk7Vtyr665BDWzJQyXOGAiLHKzXPRXYth/6cpKN9TJwopRUU6scSwAe7llu9bhg+7zljb9ZqO4UWbMUlhkKLl7ADCtC/pbKyJG/LRTtg0Cf shotrip-prod-bastion-key" 
  region     = "ap-northeast-1"
}

import {
  to = aws_key_pair.bastion
  id = "shotrip-prod-bastion-key"
}