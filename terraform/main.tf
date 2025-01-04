provider "aws" {
  # https://aws.amazon.com/fr/blogs/architecture/how-to-select-a-region-for-your-workload-based-on-sustainability-goals/
  region = "eu-north-1"
}

terraform {
  backend "s3" {
    bucket         = "cubitouch-infrastructure"
    key            = "terraform/state.tfstate" # Path in the bucket
    region         = "eu-north-1"
    encrypt        = true
  }
}

resource "aws_s3_bucket" "ingest_bucket" {
  bucket = "energy-market-france"
}

resource "aws_ssm_parameter" "file_url" {
  name  = "/energy-market-france/source-url"
  type  = "String"
  value = "https://www.data.gouv.fr/fr/datasets/r/1ae6c731-991f-4441-9663-adc99005fac5"

  lifecycle {
    ignore_changes = [value, version]
  }
}

resource "aws_iam_role" "lambda_role" {
  name = "lambda-s3-access-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Action    = "sts:AssumeRole",
      Effect    = "Allow",
      Principal = { Service = "lambda.amazonaws.com" }
    }]
  })
}

resource "aws_iam_policy" "lambda_policy" {
  name   = "lambda-s3-policy"
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      { Action = ["s3:PutObject", "s3:GetObject"], Effect = "Allow", Resource = ["${aws_s3_bucket.ingest_bucket.arn}/*"] },
      { Action = ["ssm:GetParameter"], Effect = "Allow", Resource = "*" }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_role_attach" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = aws_iam_policy.lambda_policy.arn
}

resource "aws_lambda_function" "ingestion" {
  filename         = "${path.module}/dummy-lambda.zip"
  function_name    = "energy-market-france-ingestion"
  role             = aws_iam_role.lambda_role.arn
  handler          = "lambda_function.handler"
  runtime          = "nodejs18.x"
  source_code_hash = filebase64sha256("${path.module}/dummy-lambda.zip")

  environment {
    variables = {
      S3_BUCKET = aws_s3_bucket.ingest_bucket.id
    }
  }
}
