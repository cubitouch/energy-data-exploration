import boto3
import pandas as pd
import urllib.parse
import zipfile
import dlt
import os
import csv
import pprint
import tempfile

# Initialize S3 and SSM clients
s3 = boto3.client("s3")
ssm = boto3.client("ssm")

def lambda_handler(event, context):
    if event is not None and "Records" in event:
        # Get the bucket name and object key from the event
        bucket_name = event["Records"][0]["s3"]["bucket"]["name"]
        object_key = event["Records"][0]["s3"]["object"]["key"]

        # Decode the object key
        decoded_object_key = urllib.parse.unquote(object_key)

        print(f"Processing file: s3://{bucket_name}/{decoded_object_key}")

        # Download the ZIP file from S3
        zip_file_path = f"/tmp/{decoded_object_key.split('/')[-1]}"
        s3.download_file(bucket_name, decoded_object_key, zip_file_path)
    else:
        # TODO: retrieve the most recent file in S3?
        zip_file_path = "./2025-01-05T01_28_08.403Z.zip"

    # Extract the .xls file from the ZIP
    with zipfile.ZipFile(zip_file_path, 'r') as zip_ref:
        # List files in the ZIP archive
        zip_contents = zip_ref.namelist()
        print(f"ZIP contents: {zip_contents}")

        # Look for .xls files
        xls_files = [file for file in zip_contents if file.endswith('.xls')]
        if not xls_files:
            raise FileNotFoundError("No .xls file found in the ZIP archive.")

        # Extract the first .xls file
        xls_file_name = xls_files[0]
        extracted_xls_path = f"/tmp/{xls_file_name}"
        zip_ref.extract(xls_file_name, "/tmp")

    print(f"Extracted XLS file: {extracted_xls_path}")

    print(f"Cleaning end of line tabs...")
    # Create a temporary file to store the cleaned data
    cleaned_file_path = tempfile.NamedTemporaryFile(delete=False).name
    # Open the original file and the temporary file
    with open(extracted_xls_path, "r", encoding="ISO-8859-1") as infile, open(cleaned_file_path, "w", encoding="ISO-8859-1") as outfile:
        for line in infile:
            # Remove trailing tabs and any extra whitespace at the end of the line
            cleaned_line = line.rstrip("\t").rstrip()
            # Write the cleaned line to the new file
            outfile.write(cleaned_line + "\n")

    # Now the cleaned file is saved at `cleaned_file_path`
    print(f"Cleaned file saved at: {cleaned_file_path}")

    # Load the file into a Pandas DataFrame
    # here we enforce 40 columns because the file might be malformed which shifts the cells by 1
    data = pd.read_csv(
        cleaned_file_path, 
        sep="\t", 
        encoding="ISO-8859-1", 
        usecols=range(40),
        # cleanup the last rows as they don't match the csv format
        engine="python",
        skipfooter=2,  # Adjust this number to the rows you want to skip
    )
    print(data.head())  # Print the first few rows for debugging
    print(data.tail())  # Print the last few rows for debugging
    
    # Use DLT to ingest the data into the database
    ingest_to_database(data)

def ingest_to_database(data):
    # Fetch the DSN from SSM Parameter Store
    response = ssm.get_parameter(Name="/energy-market-france/db-dsn", WithDecryption=True)
    database_dsn = response["Parameter"]["Value"]

    # Initialize DLT pipeline
    dlt_pipeline = dlt.pipeline(
        destination=dlt.destinations.postgres(database_dsn),
        dataset_name="energy_market_france"
    )

    # Replace null (NaN) values in the 'consommation' column with 0
    data["Consommation"] = data["Consommation"].fillna(0)

    # Use the generator as a resource
    resource = dlt.resource(
        data,
        name="raw_energy_market_france",
        primary_key=("date", "heures"),
        merge_key=("date", "heures", "consommation")
    )

    # Run the pipeline with the resource
    try:
        # Run the pipeline and capture the summary
        run_summary = dlt_pipeline.run(resource, write_disposition="merge")
        print("Pipeline ran successfully!")
        print(run_summary)

    except Exception as e:
        # Handle errors and clean up the pipeline
        print(f"Pipeline execution failed with error: {str(e)}")
        print("Dropping failed jobs...")
        dlt_pipeline.drop()
        print("Failed jobs cleared.")
    return

if __name__ == '__main__':
    lambda_handler(None, None)