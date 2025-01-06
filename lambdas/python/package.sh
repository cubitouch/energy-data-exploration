mkdir -p dist

# Package the Pandas layer
mkdir -p layer/pandas/python
pip install -r requirements-pandas.txt --no-cache-dir -t ./layer/pandas/python
cd layer/pandas
zip -r ../../dist/pandas-layer.zip .
cd ../..

# Package the Lambda
pip install -r requirements-package.txt --no-cache-dir -t ./package
cd package
zip -r ../dist/upsert.zip .
cd ..
zip -g dist/upsert.zip src/upsert/lambda_function.py
