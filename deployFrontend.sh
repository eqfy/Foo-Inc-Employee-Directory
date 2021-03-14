cd Frontend
echo "***Building frontend***"
yarn install
yarn build
cd ..
echo "***Deploying frontend***"
cdk deploy FrontendStack --require-approval never
echo "Done"
