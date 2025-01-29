# Data Sources

Feeds from [ecologie.data.gouv.fr](https://ecologie.data.gouv.fr/datasets/55f0463d88ee3849f5a46ec1).

# Schedules

- Ingestion (AWS Lambda) - 0AM UTC
- Data Modeling (Dbt) - 1AM UTC [![Run Dbt](https://github.com/cubitouch/energy-data-exploration/actions/workflows/run-dbt.yml/badge.svg)](https://github.com/cubitouch/energy-data-exploration/actions/workflows/run-dbt.yml)
- Publish reports (ObservableHQ/Vercel) - 2AM UTC [![Redeploy to Vercel](https://github.com/cubitouch/energy-data-exploration/actions/workflows/redeploy-vercel.yml/badge.svg)](https://github.com/cubitouch/energy-data-exploration/actions/workflows/redeploy-vercel.yml)

# TODO
- refactor legends into components
- document/explain the data source (origin, frequency, time span, etc)
- Excalidraw the hell ouf of the architecture (tools, data flow)
- add a page pointing at GitHub
- add a link back to hugocarnicelli.com
- CICD for Terraform and (Node) Lambda
- use ChartJS instead of Observable.Plot?
  - clickable legend filtering
  - single tooltip regardles of series count
- Terraform Vercel(?)
