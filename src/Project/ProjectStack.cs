using Amazon.CDK;
using Amazon.CDK.AWS.S3;
using apiGateway = Amazon.CDK.AWS.APIGateway;
using lambda = Amazon.CDK.AWS.Lambda;
using s3dep = Amazon.CDK.AWS.S3.Deployment;

namespace Project
{
    public class ProjectStack : Stack
    {
        internal ProjectStack(Construct scope, string id, IStackProps props = null) : base(scope, id, props)
        {
            // This code has been moved to the frontend stack
            //S3 Bucket to hold all the website related files
            /*Bucket websiteBucket = new Bucket(this, "webbsiteBucket", new BucketProps{
                Versioned = true,
                PublicReadAccess = true,
                WebsiteIndexDocument = "index.html"
            });*/

            

            //Lambdas
            lambda.Function getEmployees = new lambda.Function(this,"getEmployees", new lambda.FunctionProps{
                Runtime = lambda.Runtime.DOTNET_CORE_3_1,
                Code = lambda.Code.FromAsset("./Handler/src/Handler/bin/Release/netcoreapp3.1/publish"),
                Handler = "Handler::Handler.Function::Get" 
            });
            


            //APIGateway
            apiGateway.RestApi api = new apiGateway.RestApi(this, "Project-api", null);
            apiGateway.Resource employeeResource = api.Root.AddResource("employee");

            apiGateway.LambdaIntegration getEmployeeIntegration =  new apiGateway.LambdaIntegration(getEmployees);
            apiGateway.Method getEmployeeMethod =  employeeResource.AddMethod("GET", getEmployeeIntegration);


            //This code has been moved to the frontend stack
            /*s3dep.ISource[] temp = {s3dep.Source.Asset("./FrontEnd/build")};
            //deploy the frontend to the s3 bucket
            new s3dep.BucketDeployment(this,"DeployWebsite", new s3dep.BucketDeploymentProps{
                Sources = temp,
                DestinationBucket = websiteBucket
            });*/



            //CfnOutput output = new CfnOutput(this, "endpoint output", new CfnOutputProps{
            //    Value = api.Url, ExportName = "gateWayURL"
            //});
        }
    }
}
