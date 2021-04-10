while getopts "p:e:c" opt; do
  case $opt in
    p)
        userProfile=$OPTARG
        echo "User profile set to: $userProfile"
      ;;
    e)
      export DEPLOY_ENVIRONMENT=$OPTARG
      echo "Deploy environment: $DEPLOY_ENVIRONMENT" 
      copy /b src/Project/ProjectStack.cs +,,
      ;;
    c)
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
    if [ $clean ]
    then
        dbinitName=`aws lambda list-functions --profile $userProfile | awk '/ProjectStack-databaseInit/ {print $2}' | grep -v arn | tr -d , | sed -e 's/^"//' -e 's/"$//'`
        dropTablesName=`aws lambda list-functions --profile $userProfile | awk '/ProjectStack-databaseDropAll/ {print $2}' | grep -v arn | tr -d , | sed -e 's/^"//' -e 's/"$//'`
        aws lambda invoke --function-name $dropTablesName --profile $userProfile response.json
        aws lambda invoke --function-name $dbinitName --profile $userProfile response.json
    fi
else
    cdk deploy ProjectStack --outputs-file Frontend/src/endpoint.json --require-approval never
    if [ $clean ]
    then
        dbinitName=`aws lambda list-functions | awk '/ProjectStack-databaseInit/ {print $2}' | grep -v arn | tr -d , | sed -e 's/^"//' -e 's/"$//'`
        dropTablesName=`aws lambda list-functions | awk '/ProjectStack-databaseDropAll/ {print $2}' | grep -v arn | tr -d , | sed -e 's/^"//' -e 's/"$//'`
        aws lambda invoke --function-name $dropTablesName sresponse.json
        aws lambda invoke --function-name $dbinitName response.json
    fi
fi


cd Frontend
echo "***Building frontend***"
yarn install
yarn build
cd ..
echo "***Deploying frontend***"
cdk deploy FrontendStack --require-approval never
echo "Done"