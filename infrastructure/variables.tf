variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "eu-north-1" # Replace with your desired default region
}

variable "aiven_api_token" {
  description = "API token for Aiven authentication"
  type        = string
}