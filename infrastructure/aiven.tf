provider "aiven" {
  api_token = var.aiven_api_token
}

# note: aiven project was created manually and cannot be recreated on the free tier?

resource "aiven_pg" "energy_db" {
  project       = "open-data-exploration"
  cloud_name    = "do-ams"         # DigitalOcean Amsterdam region
  plan          = "free-1-5gb"
  service_name  = "open-data-exploration"

  pg_user_config {
    public_access {
      pg        = true
      prometheus = false
    }
  }
}