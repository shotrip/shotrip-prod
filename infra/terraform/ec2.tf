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
  public_key = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDAFPo+y2MhNwLgcBq9l7mn0aKLQT+FzQJb64y0hKYF5CavG3/yHg/Wavh1tEMccc+OvVcWkPvzHPmVqs3eDPyJ83MctwV+gHu+l9r1blgxwp/PtKbXE4EHKJ7GXYSGy5ZLMNyAYI69+VEXfdIc74Q55Wz+1setI8UuGSyJrJjy+WOhTWkxqgZMAMHf8Q08sJvulXEEv8WKgeGZDDdSfQak81rJXzhqiBvQK+oCJS64vhsp210B4rgtCJLKpPUtZL0ZFoMnv0/0/Pj97MZUbH2pwZ4MmSOtIcI8kb+0V64uNTY2f4Qa+OSKLG4SM2Ce2ZZgSBPbnlFQ+8B2VBKPZ3dR shotrip-prod-bastion-key" 
  region     = "ap-northeast-1"
}

import {
  to = aws_key_pair.bastion
  id = "shotrip-prod-bastion-key"
}