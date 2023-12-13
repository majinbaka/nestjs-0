#!/bin/sh
echo "Initializing localstack s3"

# Create a bucket
awslocal s3api create-bucket --bucket sample-bucket
# Create a folder
awslocal s3api put-object --bucket sample-bucket --key folder/



# list buckets
# awslocal s3api list-buckets
# Path style access
# http://localhost:4566/<bucket-name>/<key-name> # path-style request