cd Frontend
echo "***Bulding frontend***"
yarn install
yarn build
cd ..
echo "***Deploying frontend***"
cdk deploy FrontendStack
echo "Done"
