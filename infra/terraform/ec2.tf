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
  public_key = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDL2HlRJ6p+61F6S3py8sfBlU23MAL82o86TWBEaaidTbfQVOPmwLNOCOCvhdHyCRQsiDtJN5uuy2qP6XxxVDGvV04/Vl1iO3p4xo50aHpwD4Ropv4khMXCfQ4UGuKLfHgyFg6WyzxakqRaW9ozXs2F9uPvDhoFjFWt9IKGIBkJnp4CX8auGxNkEzYfv4ae8ChvZWwoQn8YSn6z7hxfs0n4P0tchiSIcwGIEY36qSNpEkNBOqjlQh27HFVeUYOEjNxGd9j2a+hOOdpJXw3r6xi9qaab1dLjSp4QjKgfEskSSX6JFLtwU8Witar2NDjlSUNuWcyWLmcedPnWKe36Ktnr shotrip-prod-bastion-key" 
  region     = "ap-northeast-1"
}

import {
  to = aws_key_pair.bastion
  id = "shotrip-prod-bastion-key"
}