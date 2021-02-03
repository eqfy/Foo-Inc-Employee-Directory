using Amazon.CDK;
using Amazon.CDK.AWS.S3;
using apiGateway = Amazon.CDK.AWS.APIGateway;
using lambda = Amazon.CDK.AWS.Lambda;
using s3dep = Amazon.CDK.AWS.S3.Deployment;
using rds = Amazon.CDK.AWS.RDS;
using ec2 = Amazon.CDK.AWS.EC2;
using Amazon.CDK.AWS.SecretsManager;

namespace Project
{
    public class ProjectStack : Stack
    {
        internal ProjectStack(Construct scope, string id, IStackProps props = null) : base(scope, id, props)
        {

            //How to get the default VPC
            /*ec2.IVpc vpc = ec2.Vpc.FromLookup(this, "VPC", new ec2.VpcLookupOptions{
                // This imports the default VPC but you can also
                // specify a 'vpcName' or 'tags'.
                IsDefault = true
            });*/

            //If this works make the security group id an environment variable
            //ec2.ISecurityGroup SG = ec2.SecurityGroup.FromLookup(this, "SG", "sg-ae37e689");


 
            //Virtual private cloud
            //reference: https://blog.codecentric.de/en/2019/09/aws-cdk-create-custom-vpc/
            ec2.Vpc vpc = new ec2.Vpc(this, "VPC", new ec2.VpcProps{
                Cidr = "10.0.0.0/16",
                MaxAzs = 2,
                SubnetConfiguration = new[]{new ec2.SubnetConfiguration{
                    CidrMask = 26,
                    Name = "isolatedSubnet",
                    SubnetType = ec2.SubnetType.ISOLATED
                }},
                NatGateways = 0
            });

            //Security group
            ec2.SecurityGroup securityGroup = new ec2.SecurityGroup(this, "security-group", new ec2.SecurityGroupProps{
                Vpc = vpc,
                AllowAllOutbound = true,
                SecurityGroupName = "inSecurityGroup",
            });
            securityGroup.AddIngressRule(ec2.Peer.Ipv4("10.0.0.0/16"), ec2.Port.Tcp(5432));

            //Subnet
            ec2.SubnetSelection selection =  new ec2.SubnetSelection{SubnetType = ec2.SubnetType.ISOLATED};

            //This is a way to do it with the secrets manager
            /*var databasePassword = new Secret(this, "DatabasePassword", new SecretProps
            {
                GenerateSecretString = new SecretStringGenerator
                {
                    PasswordLength = 20
                }
            });*/


            //database password no secretsManager
            var databasePassword = new SecretValue("123456789");

            //Database
            rds.DatabaseInstance database = new rds.DatabaseInstance(this, "database", new rds.DatabaseInstanceProps{
                Engine = rds.DatabaseInstanceEngine.Postgres(new rds.PostgresInstanceEngineProps{Version = rds.PostgresEngineVersion.VER_12}),                
                InstanceType = ec2.InstanceType.Of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.MICRO),
                Vpc = vpc,
                VpcSubnets = selection,
                AllocatedStorage = 20,
                InstanceIdentifier = "database" ,
                Credentials = rds.Credentials.FromPassword("postgres",databasePassword),
                MultiAz = false,
                Port = 5432,
                SecurityGroups = new[] {securityGroup}
            });
           



            //Lambdas
            //"./Handler/src/Handler/bin/Release/netcoreapp3.1/publish"
            lambda.Function getEmployees = new lambda.Function(this,"getEmployees", new lambda.FunctionProps{
                Runtime = lambda.Runtime.DOTNET_CORE_3_1,
                Code = lambda.Code.FromAsset("./Handler/src/Handler/bin/Release/netcoreapp3.1/publish"),
                Handler = "Handler::Handler.Function::Get",
                Vpc = vpc,
                VpcSubnets = selection,
                AllowPublicSubnet = true,
                Timeout = Duration.Seconds(60),
                //SecurityGroups = new[] {SG}
                SecurityGroups = new[] {securityGroup}  
                //SecurityGroups = new[] {ec2.SecurityGroup.FromSecurityGroupId(this,"lambdasecurity", database.Connections.SecurityGroups[0].SecurityGroupId)}
            });

            //APIGateway
            apiGateway.RestApi api = new apiGateway.RestApi(this, "Project-api", null);
            apiGateway.Resource employeeResource = api.Root.AddResource("employee");

            apiGateway.LambdaIntegration getEmployeeIntegration =  new apiGateway.LambdaIntegration(getEmployees);
            apiGateway.Method getEmployeeMethod =  employeeResource.AddMethod("GET", getEmployeeIntegration);
            
            
            //Add database information to the lambda
            //TODO pass the the needed info so there is no hardcoded stuff in the lambda
            getEmployees.AddEnvironment("RDS_ENDPOINT", database.DbInstanceEndpointAddress);
            getEmployees.AddEnvironment("RDS_PASSWORD", databasePassword.ToString());
            getEmployees.AddEnvironment("RDS_NAME", database.InstanceIdentifier);

            new CfnOutput(this, "SQLserverEndpoint", new CfnOutputProps{
                Value = database.DbInstanceEndpointAddress
            });
            
            //CfnOutput output = new CfnOutput(this, "endpoint output", new CfnOutputProps{
            //    Value = api.Url, ExportName = "gateWayURL"
            //});
        }
    }
}
