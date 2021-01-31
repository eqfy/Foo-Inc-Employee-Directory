# Run the commented command manually if you haven't before
# dotnet tool install -g Amazon.Lambda.Tools
cd Handler/src/Handler
dotnet build -c Release
dotnet lambda package
cd ../../..
cd Frontend
yarn install
yarn build
cd ..
cdk deploy ProjectStack --outputs-file Frontend/build/endpoint.json
cdk deploy FrontendStack