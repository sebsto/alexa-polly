let code = require('./index.js');
let event = {
  "resource": "\/polly\/{voice_id}",
  "path": "\/polly\/Celine",
  "httpMethod": "POST",
  "headers": null,
  "queryStringParameters": null,
  "pathParameters": {
    "voice_id": "Celine"
  },
  "stageVariables": null,
  "requestContext": {
    "accountId": "486652066693",
    "resourceId": "qmnk2v",
    "stage": "test-invoke-stage",
    "requestId": "test-invoke-request",
    "identity": {
      "cognitoIdentityPoolId": null,
      "accountId": "486652066693",
      "cognitoIdentityId": null,
      "caller": "AIDAJ7UFZGVGF7WOO56SK",
      "apiKey": "test-invoke-api-key",
      "sourceIp": "test-invoke-source-ip",
      "accessKey": "ASIAIZWMWHQD7AAKUPEA",
      "cognitoAuthenticationType": null,
      "cognitoAuthenticationProvider": null,
      "userArn": "arn:aws:iam::486652066693:user\/sst",
      "userAgent": "Apache-HttpClient\/4.5.x (Java\/1.8.0_102)",
      "user": "AIDAJ7UFZGVGF7WOO56SK"
    },
    "resourcePath": "\/polly\/{voice_id}",
    "httpMethod": "POST",
    "apiId": "do70strjt2"
  },
  "body": "Hello, comment ça va ?",
  "isBase64Encoded": false
}
code.handler(event, {}, function (error, success) {console.log(success); process.exit(0); });
