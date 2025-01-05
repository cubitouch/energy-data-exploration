variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "eu-north-1" # Replace with your desired default region
}

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

# ingestion

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

resource "aws_iam_role" "ingestion_lambda_role" {
  name = "lambda-ingestion-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Action    = "sts:AssumeRole",
      Effect    = "Allow",
      Principal = { Service = "lambda.amazonaws.com" }
    }]
  })
}

resource "aws_iam_policy" "ingestion_lambda_policy" {
  name   = "lambda-ingestion-policy"
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      { Action = ["s3:PutObject", "s3:GetObject"], Effect = "Allow", Resource = ["${aws_s3_bucket.ingest_bucket.arn}/*"] },
      { Action = ["ssm:GetParameter"], Effect = "Allow", Resource = "*" },
      {
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ],
        Effect = "Allow",
        Resource = "arn:aws:logs:${var.aws_region}:${data.aws_caller_identity.current.account_id}:*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ingestion_lambda_attach" {
  role       = aws_iam_role.ingestion_lambda_role.name
  policy_arn = aws_iam_policy.ingestion_lambda_policy.arn
}

resource "aws_lambda_function" "ingestion" {
  filename         = "${path.module}/../lambdas/node/dist/ingestion.zip"
  function_name    = "energy-market-france-ingestion"
  role             = aws_iam_role.ingestion_lambda_role.arn
  handler          = "index.handler"
  runtime          = "nodejs18.x"
  source_code_hash = filebase64sha256("${path.module}/../lambdas/node/dist/ingestion.zip")

  timeout = 15 # Set timeout in seconds (maximum: 900 seconds)

  environment {
    variables = {
      S3_BUCKET = aws_s3_bucket.ingest_bucket.id
    }
  }
}

# storage

resource "aws_ssm_parameter" "db_dsn" {
  name  = "/energy-market-france/db-dsn"
  type  = "String"
  value = "PLACEHOLDER"

  lifecycle {
    ignore_changes = [value, version]
  }
}

resource "aws_lambda_layer_version" "pandas_layer" {
  filename          = "${path.module}/../lambdas/python/dist/pandas-layer.zip"
  layer_name        = "pandas-layer"
  compatible_runtimes = ["python3.9"]
}

resource "aws_iam_role" "upsert_lambda_role" {
  name = "lambda-upsert-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Action    = "sts:AssumeRole",
      Effect    = "Allow",
      Principal = { Service = "lambda.amazonaws.com" }
    }]
  })
}

resource "aws_iam_policy" "lambda_upsert_policy" {
  name   = "lambda-upsert-policy"
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = ["s3:GetObject"],
        Effect = "Allow",
        Resource = "${aws_s3_bucket.ingest_bucket.arn}/*"
      },
      {
        Action = ["ssm:GetParameter"],
        Effect = "Allow",
        Resource = "arn:aws:ssm:${var.aws_region}:${data.aws_caller_identity.current.account_id}:parameter/energy-market-france/db-dsn"
      },
      {
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ],
        Effect = "Allow",
        Resource = "arn:aws:logs:${var.aws_region}:${data.aws_caller_identity.current.account_id}:*"
      }
    ]
  })
}


resource "aws_iam_role_policy_attachment" "upsert_lambda_attach" {
  role       = aws_iam_role.upsert_lambda_role.name
  policy_arn = aws_iam_policy.lambda_upsert_policy.arn
}
resource "aws_iam_role_policy_attachment" "lambda_insights_attach" {
  role       = aws_iam_role.upsert_lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchLambdaInsightsExecutionRolePolicy"
}


resource "aws_lambda_function" "upsert" {
  filename         = "${path.module}/../lambdas/python/dist/upsert.zip"
  function_name    = "energy-market-france-upsert"
  role             = aws_iam_role.upsert_lambda_role.arn
  handler          = "src/upsert/lambda_function.lambda_handler"
  runtime          = "python3.9"
  source_code_hash = filebase64sha256("${path.module}/../lambdas/python/dist/upsert.zip")

  memory_size      = 512  # Increase to load files into pandas dataframe
  timeout          = 600 # Set timeout in seconds (maximum: 900 seconds)
  layers           = [
    aws_lambda_layer_version.pandas_layer.arn,
    "arn:aws:lambda:eu-north-1:580247275435:layer:LambdaInsightsExtension:14"
  ]
}

resource "aws_s3_bucket_notification" "ingest_bucket_notifications" {
  bucket = aws_s3_bucket.ingest_bucket.id

  lambda_function {
    lambda_function_arn = aws_lambda_function.upsert.arn
    events              = ["s3:ObjectCreated:*"]
    filter_prefix       = "data/"
  }

  depends_on = [aws_lambda_permission.allow_s3_to_invoke]
}

resource "aws_lambda_permission" "allow_s3_to_invoke" {
  statement_id  = "AllowS3Invoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.upsert.function_name
  principal     = "s3.amazonaws.com"

  source_arn = aws_s3_bucket.ingest_bucket.arn
}
