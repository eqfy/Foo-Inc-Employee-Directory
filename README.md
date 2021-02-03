# Foo Inc. Associated Engineering Project


## Deploy instructions: Start folder is **Foo-inc/**
* cd Handler/src/Handler
* dotnet build -c Release
* dotnet tool install -g Amazon.Lambda.Tools  **only if you haven't already done this before**
* dotnet lambda package
* cd ../../..
* cd Frontend
* yarn build
* cd ..
* cdk deploy ProjectStack --outputs-file Frontend/build/endpoint.json
* cdk deploy FrontendStack


for lambdas (in Handler/src/Handler):
* dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
* dotnet add package Microsoft.AspNet.Identity --version 3.0.0-rc1-final
* dotnet add package Microsoft.AspNet.Identity.EntityFramework
* dotnet add package Microsoft.EntityFrameworkCore.Tools --version 5.0.2
* dotnet add package System.Data.SqlClient
* dotnet add package Npgsql --version 5.0.3


## Database:
The database is in an Isolated VPC so it can't be connected to from local machines. 

How to connect locally:
* Change the all VPC subnetTypes to to PUBLIC
* Add `PubliclyAccessible = true` to the DatabaseInstanceProps constructor.
* Add an inbound rule that allows everything `securityGroup.AddIngressRule(ec2.Peer.Ipv4("0.0.0.0/0"), ec2.Port.Tcp(5432));` should work but if not you can do it from the AWS console.

