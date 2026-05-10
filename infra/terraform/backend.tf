terraform {
  backend "s3" {
    bucket = "shotrip-prod-tfstate"
    key = "prod/terraform.tfstate"
    region = "ap-northeast-1"
    use_lockfile = true
    profile = "shotrip-prod"
    encrypt = true
  }
}