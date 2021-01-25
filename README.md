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

