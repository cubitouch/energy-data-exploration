# Use the official AWS Lambda Python 3.9 base image
FROM public.ecr.aws/lambda/python:3.9

# Set the working directory inside the container
WORKDIR /var/task

# Copy your function code into the container
COPY ./src ./

# For local testing
COPY ./2025-01-05T01_28_08.403Z.zip 2025-01-05T01_28_08.403Z.zip

# Install additional dependencies
COPY ./requirements.txt ./
RUN pip install -r requirements.txt --target /var/task

# Specify the handler function to run when the Lambda is invoked
# The format is "<filename>.<handler>"
CMD ["upsert.lambda_function.lambda_handler"]
