# AWS Polly to Alexa MP3 converter

This is a web service that generates TTS MP3 using AWS Polly and prepare them to use with Alexa.
This web service is implemented as an AWS Lambda function, bundled with ``ffmpeg``'s encoding tool.
The code is deployed using AWS SAM serverless framework.

## Usage 

```
$ curl https://o4gxgxfy8k.execute-api.us-east-1.amazonaws.com/Prod/polly/Celine -d "Bonjour"
<audio src="https://alexademo.ninja/polly/c657a7e1-1fc2-4f79-93b8-635abfaeba16"/>
```

You can test the generated MP3 by copy / pasting the code in the Alexa developer console.

Aletrnatively, on MAc, you can type the following commands :

```
$ wget -q https://alexademo.ninja/polly/c657a7e1-1fc2-4f79-93b8-635abfaeba16
$ afplay c657a7e1-1fc2-4f79-93b8-635abfaeba16
$ rm c657a7e1-1fc2-4f79-93b8-635abfaeba16
```

## Pre-requesites

### AWS CLI

Obviosuly, you need an AWS Account :-) and AWS CLI properly configured

### S3 bucket

You need to have an S3 bucket in the same region as the one where you will deploy the code.
That bucket must be configured to serve HTTP requests.

To make the bucket available as ``https://<bucket_name>`` with a TLS certificate accepted by Alexa,  
I exposed the bucket through a CloudFront distribution, my own domain name and a certificate  
provided by AWS Certificate Manager.

## Deploy 

1. Modify the name of the bucket in package.sh

2. In a terminal, type 

```./package.sh && ./deploy.sh```

## TODO 

Expose the API endpoint with a custom domain name and TLS certificate