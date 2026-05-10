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
  default = "admin"
}

variable "stripe_price_tokens_100" {
  type = string
  default = "prod_U3OZ67ui9osatq"
}

variable "stripe_price_tokens_30" {
  type = string
  default = "prod_U3OYNuxV0hgFwn"
}

variable "stripe_price_unlimited_month" {
  type = string
  default = "prod_U3OZ1sRufJvbP1"
}

variable "google_client_id" {
  type = string
  default = "116683359436-o5gqnpef03erlg33kamf2sontndbr240.apps.googleusercontent.com"
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