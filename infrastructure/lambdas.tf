# s3 storage
resource "aws_s3_bucket" "ingest_bucket" {
  bucket = "energy-market-france"
}

# ingestion lambda
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

# Create an EventBridge rule for scheduling
resource "aws_cloudwatch_event_rule" "midnight_schedule" {
  name                = "energy-market-ingestion-schedule"
  description         = "Triggers the ingestion Lambda function daily at midnight"
  schedule_expression = "cron(0 0 * * ? *)" # Every day at midnight UTC
}

# Attach the Lambda function as a target of the EventBridge rule
resource "aws_cloudwatch_event_target" "ingestion_lambda_target" {
  rule      = aws_cloudwatch_event_rule.midnight_schedule.name
  target_id = "ingestion-lambda-target"
  arn       = aws_lambda_function.ingestion.arn
}

# Grant EventBridge permission to invoke the Lambda function
resource "aws_lambda_permission" "allow_eventbridge" {
  statement_id  = "AllowExecutionFromEventBridge"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.ingestion.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.midnight_schedule.arn
}

# upsert lambda
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

resource "aws_iam_role_policy_attachment" "lambda_insights_attach_upsert" {
  role       = aws_iam_role.upsert_lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchLambdaInsightsExecutionRolePolicy"
}

resource "aws_lambda_function" "upsert" {
  function_name    = "energy-market-france-upsert"
  role             = aws_iam_role.upsert_lambda_role.arn
  package_type     = "Image"
  image_uri        = "${aws_ecr_repository.lambda_upsert_repo.repository_url}:latest"

  memory_size      = 512  # Increase to load files into pandas dataframe
  timeout          = 600 # Set timeout in seconds (maximum: 900 seconds)
  publish          = true # updates the function when new image is published
  
  # Override the default handler with the specific handler for this Lambda
  image_config {
    command = ["upsert.lambda_function.lambda_handler"]
  }
  
  # Ensure CloudWatch Lambda Insights layer for container support is added if needed
  environment {
    variables = {
      LOG_LEVEL = "DEBUG" # Example variable
    }
  }
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


# ingest_energy_reports lambda
resource "aws_iam_role" "ingest_energy_reports_lambda_role" {
  name = "lambda-ingest-energy-reports-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Action    = "sts:AssumeRole",
      Effect    = "Allow",
      Principal = { Service = "lambda.amazonaws.com" }
    }]
  })
}

resource "aws_iam_policy" "lambda_ingest_energy_reports_policy" {
  name   = "lambda-ingest-energy-reports-policy"
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
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

resource "aws_iam_role_policy_attachment" "ingest_energy_reports_lambda_attach" {
  role       = aws_iam_role.ingest_energy_reports_lambda_role.name
  policy_arn = aws_iam_policy.lambda_ingest_energy_reports_policy.arn
}

resource "aws_iam_role_policy_attachment" "lambda_insights_attach_ingest_energy_reports" {
  role       = aws_iam_role.ingest_energy_reports_lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchLambdaInsightsExecutionRolePolicy"
}

resource "aws_lambda_function" "ingest_energy_reports" {
  function_name    = "energy-market-france-ingest-energy-reports"
  role             = aws_iam_role.ingest_energy_reports_lambda_role.arn
  package_type     = "Image"
  image_uri        = "${aws_ecr_repository.lambda_upsert_repo.repository_url}:latest"

  memory_size      = 1024  # Increase to load files into pandas dataframe
  timeout          = 600 # Set timeout in seconds (maximum: 900 seconds)
  publish          = true # updates the function when new image is published
  
  # Override the default handler with the specific handler for this Lambda
  image_config {
    command = ["ingestion_energy_performance.lambda_function.lambda_handler"]
  }
  
  # Ensure CloudWatch Lambda Insights layer for container support is added if needed
  environment {
    variables = {
      LOG_LEVEL = "DEBUG" # Example variable
    }
  }
}