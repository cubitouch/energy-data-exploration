provider "aws" {
  # https://aws.amazon.com/fr/blogs/architecture/how-to-select-a-region-for-your-workload-based-on-sustainability-goals/
  region = var.aws_region
}

terraform {
  backend "s3" {
    bucket         = "cubitouch-infrastructure"
    key            = "terraform/state.tfstate" # Path in the bucket
    region         = "eu-north-1"
    encrypt        = true
  }
}

data "aws_caller_identity" "current" {}

