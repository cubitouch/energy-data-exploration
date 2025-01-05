resource "aws_ssm_parameter" "file_url" {
  name  = "/energy-market-france/source-url"
  type  = "String"
  value = "https://www.data.gouv.fr/fr/datasets/r/1ae6c731-991f-4441-9663-adc99005fac5"

  lifecycle {
    ignore_changes = [value, version]
  }
}

resource "aws_ssm_parameter" "db_dsn" {
  name  = "/energy-market-france/db-dsn"
  type  = "String"
  value = "PLACEHOLDER"

  lifecycle {
    ignore_changes = [value, version]
  }
}