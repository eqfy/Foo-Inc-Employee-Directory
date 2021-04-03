while getopts "p:e:c" opt; do
  case $opt in
    p)
        userProfile=$OPTARG
        echo "User profile set to: $userProfile"
      ;;
    e)
      export DEPLOY_ENVIRONMENT=$OPTARG
      echo "Deploy environment: $DEPLOY_ENVIRONMENT" 
      ;;
    c)
      #TODO pass the lambda names into environment variables so we can call them
      clean=true
      ;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      exit 1
      ;;
    :)
      echo "Option -$OPTARG requires an argument." >&2
      exit 1
      ;;
  esac
done



# Run the commented command manually if you haven't before
# dotnet tool install -g Amazon.Lambda.Tools
cd Handler/src/Handler
echo "***Building backend***"
dotnet build -c Release
dotnet lambda package
cd ../../..
echo "***Deploying backend***"
if [ $userProfile ]
then
    cdk deploy ProjectStack --outputs-file Frontend/src/endpoint.json --require-approval never --profile $userProfile
else
    cdk deploy ProjectStack --outputs-file Frontend/src/endpoint.json --require-approval never
fi
cd Frontend
echo "***Building frontend***"
yarn install
yarn build
cd ..
echo "***Deploying frontend***"
cdk deploy FrontendStack --require-approval never
echo "Done"