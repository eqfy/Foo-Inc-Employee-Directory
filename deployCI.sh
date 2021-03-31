dotnet tool install -g Amazon.Lambda.Tools
cd Handler/src/Handler
echo "***Building backend***"
dotnet build -c Release
dotnet lambda package
cd ../../..
echo "***Deploying backend***"
cdk deploy ProjectStack --outputs-file Frontend/src/endpoint.json --require-approval never
cd Frontend
echo "***Building frontend***"
yarn install
CI='' yarn build
cd ..
echo "***Deploying frontend***"
cdk deploy FrontendStack --require-approval never
echo "Done"