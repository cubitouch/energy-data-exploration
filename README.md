# Data Sources

Feeds from [ecologie.data.gouv.fr](https://ecologie.data.gouv.fr/datasets/55f0463d88ee3849f5a46ec1).

# Schedules

- Ingestion (AWS Lambda) - 0AM UTC
- Data Modeling (Dbt) - 1AM UTC [![Run Dbt](https://github.com/cubitouch/energy-data-exploration/actions/workflows/run-dbt.yml/badge.svg)](https://github.com/cubitouch/energy-data-exploration/actions/workflows/run-dbt.yml)
- Publish reports (ObservableHQ/Vercel) - 2AM UTC [![Redeploy to Vercel](https://github.com/cubitouch/energy-data-exploration/actions/workflows/redeploy-vercel.yml/badge.svg)](https://github.com/cubitouch/energy-data-exploration/actions/workflows/redeploy-vercel.yml)

# TODO
- Excalidraw the hell ouf of the architecture (tools, data flow)
- Data Quality: add data freshness indicator
- Add linear regression chart to show correlation between non-clean energy and carbon footprint
- Add charts to represent usage and working/ooo hours
- Add headlines (e.g. total/avg energy used over the period)
- Refactor data models to:
  * put business logic (co2, energy origin category) in `intermediate` layer
  * have `fact` models for hour and day aggregated data
- Publish [Elementary](https://docs.elementary-data.com/oss/oss-introduction) report as artefact if tests are failing?
- Ingest meteorological data (wind speed, solar radiation, rainfall) to correlate with renewables
- Add comparison with previous period
- Find better formatting solution (12k MW -> 12B W?)
- refactor FileAttachment time period switcher into a helper
- CICD for Terraform and (Node) Lambda
- use ChartJS instead of Observable.Plot?
  - clickable legend filtering
  - single tooltip regardles of series count
- Terraform Vercel(?)
