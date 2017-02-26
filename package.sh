aws cloudformation package \
   --template-file alexa-sa-polly.yaml \
   --output-template-file serverless-output.yaml \
   --s3-bucket alexademo.ninja \
   --s3-prefix alexa-sa-polly

