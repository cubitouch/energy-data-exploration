# Data Analysis

Feeds from [ecologie.data.gouv.fr](https://ecologie.data.gouv.fr/datasets/55f0463d88ee3849f5a46ec1).

# Manual steps

* Trigger the `ingestion` lambda from [here](https://eu-north-1.console.aws.amazon.com/lambda/home?region=eu-north-1#/functions/energy-market-france-ingestion?tab=testing)
* Check the logs of the `upsert` lambda from [here](https://eu-north-1.console.aws.amazon.com/cloudwatch/home?region=eu-north-1#logsV2:log-groups/log-group/$252Faws$252Flambda$252Fenergy-market-france-upsert), wait for the data load to end
* Trigger the Dbt` Cloud job from [here](https://ea043.us1.dbt.com/deploy/70471823412077/projects/70471823414349/jobs/70471823414370), wait for it to complete
* Redeploy the last deployment from [Vercel](https://vercel.com/hugo-carnicellis-projects/energy-data-exploration/deployments)

# Schedules

* Ingestion - 0AM UTC
* Dbt Cloud - 1AM UTC
* Vercel - 2AM UTC

# TODO
* add inputs (time periods: last 7/30/90 days)
* Terraform Vercel(?)
* CICD for Terraform and Lambdas
* Schedule dbt core without dbt cloud