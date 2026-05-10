variable "aws_account_id" {
  type = string
  default = "836533915016"
}

variable "github_prod_repo" {
  type = string
  default = "shotrip/shotrip-prod"
  description = "shotrip-prod"
}

variable "env" {
  type = string
  default = "prod"
}

variable "project" {
  type = string
  default = "shotrip-tourism"
}

variable "securitylevel" {
  type = string
  default = "Admin"
}

variable "stripe_price_tokens_100" {
  type = string
  default = "xxx"
}

variable "stripe_price_tokens_30" {
  type = string
  default = "xxx"
}

variable "stripe_price_unlimited_month" {
  type = string
  default = "xxx"
}

variable "google_client_id" {
  type = string
  default = "xxx"
}

variable "google_client_secret" {
  type = string
  sensitive   = true
  default = "xxx"
}

variable "bastion_allowed_ip" {
  type        = string
  sensitive   = true
  default = "162.120.184.18/32"
}