using Amazon.CDK;
using Amazon.CDK.AWS.S3;
using apiGateway = Amazon.CDK.AWS.APIGateway;
using lambda = Amazon.CDK.AWS.Lambda;
using s3dep = Amazon.CDK.AWS.S3.Deployment;

namespace Project
{
    public class FrontendStack : Stack
    {
        public string apiUrl;

        internal FrontendStack(Construct scope, string id, IStackProps props = null) : base(scope, id, props)
        {
            //S3 Bucket to hold all the website related files
            Bucket websiteBucket = new Bucket(this, "webbsiteBucket", new BucketProps{
                Versioned = true,
                PublicReadAccess = true,
                WebsiteIndexDocument = "index.html",
                WebsiteErrorDocument = "index.html",
            });

            s3dep.ISource[] temp = {s3dep.Source.Asset("./FrontEnd/build")};
            //deploy the frontend to the s3 bucket
            new s3dep.BucketDeployment(this,"DeployWebsite", new s3dep.BucketDeploymentProps{
                Sources = temp,
                DestinationBucket = websiteBucket
            });
        }
    }
}
