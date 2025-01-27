resource "aws_ecr_repository" "lambda_upsert_repo" {
  name                 = "lambda-upsert"
  image_scanning_configuration {
    scan_on_push = true
  }
  image_tag_mutability = "MUTABLE" # Allow updating tags like 'latest'
}

resource "aws_ecr_lifecycle_policy" "lambda_upsert_policy" {
  repository = aws_ecr_repository.lambda_upsert_repo.name

  policy = <<EOL
{
  "rules": [
    {
      "rulePriority": 1,
      "description": "Expire untagged images after 30 days",
      "selection": {
        "tagStatus": "untagged",
        "countType": "sinceImagePushed",
        "countUnit": "days",
        "countNumber": 7
      },
      "action": {
        "type": "expire"
      }
    }
  ]
}
EOL
}


output "ecr_repository_uri" {
  value = aws_ecr_repository.lambda_upsert_repo.repository_url
}