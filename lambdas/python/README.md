
Run the Python lambda on Docker
```
# Build the image
docker build -t lambda-upsert-test .

# Run it
docker run --rm \
    -p 9000:8080 \
    -e AWS_ACCESS_KEY_ID=$(aws configure get aws_access_key_id) \
    -e AWS_SECRET_ACCESS_KEY=$(aws configure get aws_secret_access_key) \
    -e AWS_SESSION_TOKEN=$(aws configure get aws_session_token) \
    -e AWS_DEFAULT_REGION=$(aws configure get region) \
    lambda-upsert-test

# Then trigger it over HTTP
curl -X POST "http://localhost:9000/2015-03-31/functions/function/invocations" -d '{"key1": "value1", "key2": "value2"}'
```