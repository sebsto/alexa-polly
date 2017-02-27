# The bucket where to upload Polly's MP3
#
# To use this bucket as an URL that can be consumed by Alexa,
# you have to configure the bucket to serve web content
# you also need to have a valid and recognized SSL certificate 
# <bucket_name>.s3.amaonaws.com is not recognized by browsers,
# So I am using a cloudfront distribution, pointing to the bucket 
# and using a AWS Certificate associated to it
S3_BUCKET=alexademo.ninja

# add bucket name in AWS SAM config file 
# the below line is likely to NOT WORK on Linux (Mac only)
sed -i "" -s "s/S3_BUCKET/$S3_BUCKET/g" alexa-sa-polly.yaml

# package code and generate the cloudformtion template
aws cloudformation package \
   --template-file alexa-sa-polly.yaml \
   --output-template-file serverless-output.yaml \
   --s3-bucket $S3_BUCKET \
   --s3-prefix alexa-sa-polly

