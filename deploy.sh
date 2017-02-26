aws cloudformation deploy \
    --region us-east-1 \
    --template-file ./serverless-output.yaml \
    --stack-name alexa-sa-polly \
    --capabilities CAPABILITY_IAM
