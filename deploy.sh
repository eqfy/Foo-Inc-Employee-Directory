# Run the commented command manually if you haven't before
# dotnet tool install -g Amazon.Lambda.Tools
cd Handler/src/Handler
echo "***Bulding backend***"
dotnet build -c Release
dotnet lambda package
cd ../../..
echo "***Deploying backend***"
cdk deploy ProjectStack --outputs-file Frontend/src/endpoint.json
cd Frontend
echo "***Bulding frontend***"
yarn install
yarn build
cd ..
echo "***Deploying frontend***"
cdk deploy FrontendStack
echo "Done"