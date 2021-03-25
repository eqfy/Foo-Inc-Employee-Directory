for package in AWS.APIGateway AWS.Cognito AWS.EC2 AWS.IAM AWS.Lambda AWS.RDS AWS.S3 AWS.S3.Deployment AWS.SecretsManager
do 
    dotnet add package Amazon.CDK.${package} --version 1.94.1
done