import boto3
import pandas as pd
import urllib.parse
import zipfile
import dlt
import os
import csv
import pprint
import tempfile

from dlt.sources.rest_api import rest_api_source
import dlt

# Initialize S3 and SSM clients
ssm = boto3.client("ssm")


# REST API source for querying one district
def energy_reports_source():
    return rest_api_source(
        {
            "client": {
                "base_url": "https://data.ademe.fr/data-fair/api/v1/datasets/dpe03existant/",
                "paginator": {
                    "type": "json_link",
                    "next_url_path": "next",
                },
            },
            "resource_defaults": {
                "primary_key": "numero_dpe",
                "write_disposition": "merge",
                "table_name": "energy_reports_2025",
                "endpoint": {
                    "params": {
                        "size": 10_000,
                        "sort": "date_reception_dpe",
                        "select": "numero_dpe,date_etablissement_dpe,etiquette_ges,etiquette_dpe,annee_construction,type_installation_ecs,periode_construction,surface_habitable_logement,classe_inertie_batiment,numero_etage_appartement,nom_commune_ban,code_region_ban,code_postal_ban",
                    },
                },
            },
            "resources": [
                {
                    "name": f"district_{postal_code}",
                    "endpoint": {
                        "path": "lines",
                        "params": {
                            "q_fields": "code_postal_ban",
                            "q": postal_code,  # Postal code for each district
                        },
                    },
                }
                for postal_code in [
                    f"750{str(district).zfill(2)}" for district in range(1, 21)
                ]
                + ["75116"]
            ],
        },
        parallelized=True,
    )


def lambda_handler(event, context):
    # Fetch the DSN from SSM Parameter Store
    response = ssm.get_parameter(
        Name="/energy-market-france/db-dsn", WithDecryption=True
    )
    database_dsn = response["Parameter"]["Value"]
    pipeline_destination = dlt.destinations.postgres(database_dsn)

    # Configure DLT to enable parallelism
    pipeline = dlt.pipeline(
        pipeline_name="energy_reports",
        destination=pipeline_destination,
        dataset_name="energy_data",
    )

    # Create the energy reports source
    source = energy_reports_source()

    # Run the pipeline with the resource
    try:
        # Run the pipeline and capture the summary
        pipeline.drop()

        # tweak for performance
        dlt.config["normalize.data_writer.file_max_items"] = 500
        dlt.config["normalize.data_writer.file_max_bytes"] = 500_000
        dlt.config["load.workers"] = 2

        run_summary = pipeline.run(source)
        print("Pipeline ran successfully!")
        print(run_summary)

    except Exception as e:
        # Handle errors and clean up the pipeline
        print(f"Pipeline execution failed with error: {str(e)}")
        print("Dropping failed jobs...")
        pipeline.drop()
        print("Failed jobs cleared.")
    return


if __name__ == "__main__":
    lambda_handler(None, None)
