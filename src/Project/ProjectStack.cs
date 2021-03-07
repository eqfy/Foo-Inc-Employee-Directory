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

            /*
            //How to get the default VPC
            ec2.IVpc vpc = ec2.Vpc.FromLookup(this, "VPC", new ec2.VpcLookupOptions{
                // This imports the default VPC but you can also
                // specify a 'vpcName' or 'tags'.
                IsDefault = true
            });

            //If this works make the security group id an environment variable
            ec2.ISecurityGroup securityGroup = ec2.SecurityGroup.FromLookup(this, "SG", "sg-ae37e689");
            */

 
            
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


            //Add the VPC endpoint for the S3 bucket so the lambdas can read from the database scripts bucket
            vpc.AddGatewayEndpoint("s3Endpoint", new ec2.GatewayVpcEndpointOptions{
                Service = ec2.GatewayVpcEndpointAwsService.S3,
                Subnets = (ec2.ISubnetSelection[])selection.Subnets
            });





            //database password no secretsManager
            var databasePassword = new SecretValue("123456789");

            //This is a way to do it with the secrets manager
            /*var databasePassword = new Secret(this, "DatabasePassword", new SecretProps
            {
                GenerateSecretString = new SecretStringGenerator
                {
                    PasswordLength = 20
                }
            });*/

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
            string[] cors_headers = {"Content-Type","X-Amz-Date,Authorization","X-Api-Key","X-Amz-Security-Token"};
 
            apiGateway.RestApi api = new apiGateway.RestApi(this, "Project-api", new apiGateway.RestApiProps{
                DefaultCorsPreflightOptions = new apiGateway.CorsOptions{
                    AllowOrigins = apiGateway.Cors.ALL_ORIGINS,
                    AllowHeaders = cors_headers,
                    AllowMethods = apiGateway.Cors.ALL_METHODS
                }
            });
            

            apiGateway.Resource employeeResource = api.Root.AddResource("employee");

            apiGateway.LambdaIntegration getEmployeeIntegration =  new apiGateway.LambdaIntegration(getEmployees);
            apiGateway.Method getEmployeeMethod =  employeeResource.AddMethod("GET", getEmployeeIntegration);
            
            lambda.Function getEmployeeByName = new lambda.Function(this,"getEmployeeByName", new lambda.FunctionProps{
                Runtime = lambda.Runtime.DOTNET_CORE_3_1,
                Code = lambda.Code.FromAsset("./Handler/src/Handler/bin/Release/netcoreapp3.1/publish"),
                Handler = "Handler::Handler.Function::GetByName",
                Vpc = vpc,
                VpcSubnets = selection,
                AllowPublicSubnet = true,
                Timeout = Duration.Seconds(60),
                //SecurityGroups = new[] {SG}
                SecurityGroups = new[] {securityGroup}  
                //SecurityGroups = new[] {ec2.SecurityGroup.FromSecurityGroupId(this,"lambdasecurity", database.Connections.SecurityGroups[0].SecurityGroupId)}
            });
            apiGateway.Resource employeeByNameResource = api.Root.AddResource("employeeByName");
            apiGateway.LambdaIntegration getEmployeeByNameIntegration =  new apiGateway.LambdaIntegration(getEmployeeByName);
            apiGateway.Method getEmployeeByNameMethod =  employeeByNameResource.AddMethod("GET", getEmployeeByNameIntegration);
 
            lambda.Function getAllFilters = new lambda.Function(this,"getAllFilters", new lambda.FunctionProps{
                Runtime = lambda.Runtime.DOTNET_CORE_3_1,
                Code = lambda.Code.FromAsset("./Handler/src/Handler/bin/Release/netcoreapp3.1/publish"),
                Handler = "Handler::Handler.Function::GetAllFilters",
                Vpc = vpc,
                VpcSubnets = selection,
                AllowPublicSubnet = true,
                Timeout = Duration.Seconds(60),
                //SecurityGroups = new[] {SG}
                SecurityGroups = new[] {securityGroup}  
                //SecurityGroups = new[] {ec2.SecurityGroup.FromSecurityGroupId(this,"lambdasecurity", database.Connections.SecurityGroups[0].SecurityGroupId)}
            });
            apiGateway.Resource getAllFiltersResource = api.Root.AddResource("getAllFilters");
            apiGateway.LambdaIntegration getAllFiltersIntegration =  new apiGateway.LambdaIntegration(getAllFilters);
            apiGateway.Method getAllFiltersMethod =  getAllFiltersResource.AddMethod("GET", getAllFiltersIntegration);

            lambda.Function getOrgChart = new lambda.Function(this,"getOrgChart", new lambda.FunctionProps{
                Runtime = lambda.Runtime.DOTNET_CORE_3_1,
                Code = lambda.Code.FromAsset("./Handler/src/Handler/bin/Release/netcoreapp3.1/publish"),
                Handler = "Handler::Handler.Function::GetOrgChart",
                Vpc = vpc,
                VpcSubnets = selection,
                AllowPublicSubnet = true,
                Timeout = Duration.Seconds(60),
                //SecurityGroups = new[] {SG}
                SecurityGroups = new[] {securityGroup}  
                //SecurityGroups = new[] {ec2.SecurityGroup.FromSecurityGroupId(this,"lambdasecurity", database.Connections.SecurityGroups[0].SecurityGroupId)}
            });
            
            apiGateway.Resource orgChartResource = api.Root.AddResource("orgChart");
            apiGateway.LambdaIntegration getOrgChartIntegration =  new apiGateway.LambdaIntegration(getOrgChart);
            apiGateway.Method getOrgChartMethod =  orgChartResource.AddMethod("GET", getOrgChartIntegration);


            //search Enpoint
            lambda.Function search = new lambda.Function(this,"search", new lambda.FunctionProps{
                Runtime = lambda.Runtime.DOTNET_CORE_3_1,
                Code = lambda.Code.FromAsset("./Handler/src/Handler/bin/Release/netcoreapp3.1/publish"),
                Handler = "Handler::Handler.Function::search",
                Vpc = vpc,
                VpcSubnets = selection,
                AllowPublicSubnet = true,
                Timeout = Duration.Seconds(60),
                //SecurityGroups = new[] {SG}
                SecurityGroups = new[] {securityGroup}  
                //SecurityGroups = new[] {ec2.SecurityGroup.FromSecurityGroupId(this,"lambdasecurity", database.Connections.SecurityGroups[0].SecurityGroupId)}
            });
            apiGateway.Resource searchResource = api.Root.AddResource("search");
            apiGateway.LambdaIntegration searchIntegration =  new apiGateway.LambdaIntegration(search);
            apiGateway.Method searchMethod =  searchResource.AddMethod("GET", searchIntegration);

            //getEmployeeID Enpoint
            lambda.Function getEmployeeID = new lambda.Function(this,"getEmployeeID", new lambda.FunctionProps{
                Runtime = lambda.Runtime.DOTNET_CORE_3_1,
                Code = lambda.Code.FromAsset("./Handler/src/Handler/bin/Release/netcoreapp3.1/publish"),
                Handler = "Handler::Handler.Function::getEmployeeID",
                Vpc = vpc,
                VpcSubnets = selection,
                AllowPublicSubnet = true,
                Timeout = Duration.Seconds(60),
                //SecurityGroups = new[] {SG}
                SecurityGroups = new[] {securityGroup}  
                //SecurityGroups = new[] {ec2.SecurityGroup.FromSecurityGroupId(this,"lambdasecurity", database.Connections.SecurityGroups[0].SecurityGroupId)}
            });
            apiGateway.Resource getEmployeeIDResource = api.Root.AddResource("getEmployeeIDResource");
            apiGateway.LambdaIntegration getEmployeeIDIntegration =  new apiGateway.LambdaIntegration(getEmployeeID);
            apiGateway.Method getEmployeeIDMethod =  getEmployeeIDResource.AddMethod("GET", getEmployeeIDIntegration);


            
            lambda.Function databaseInitLambda = new lambda.Function(this,"databaseInit", new lambda.FunctionProps{
                Runtime = lambda.Runtime.DOTNET_CORE_3_1,
                Code = lambda.Code.FromAsset("./Handler/src/Handler/bin/Release/netcoreapp3.1/publish"),
                Handler = "Handler::Handler.Function::Init",
                Vpc = vpc,
                VpcSubnets = selection,
                AllowPublicSubnet = true,
                Timeout = Duration.Seconds(30),
                SecurityGroups = new[] {securityGroup}  
            });

            lambda.Function databaseDropAllLambda = new lambda.Function(this,"databaseDropAll", new lambda.FunctionProps{
                Runtime = lambda.Runtime.DOTNET_CORE_3_1,
                Code = lambda.Code.FromAsset("./Handler/src/Handler/bin/Release/netcoreapp3.1/publish"),
                Handler = "Handler::Handler.Function::dropAll",
                Vpc = vpc,
                VpcSubnets = selection,
                AllowPublicSubnet = true,
                Timeout = Duration.Seconds(60),
                SecurityGroups = new[] {securityGroup}  
            });


            //S3 Bucket to hold all Database scripts
            Bucket databaseScriptsBucket = new Bucket(this, "databaseScriptsBucket", new BucketProps{
                Versioned = true,
                PublicReadAccess = false
            });
            databaseScriptsBucket.GrantRead(databaseInitLambda);
            databaseScriptsBucket.GrantRead(databaseDropAllLambda);
            databaseScriptsBucket.GrantRead(getOrgChart);
            databaseScriptsBucket.GrantRead(getEmployeeByName);
            databaseScriptsBucket.GrantRead(search);
            databaseScriptsBucket.GrantRead(getEmployeeID);



            s3dep.ISource[] temp = {s3dep.Source.Asset("./Database")};
            //deploy the database scripts to the s3 bucket
            new s3dep.BucketDeployment(this,"DeployDatabaseScripts", new s3dep.BucketDeploymentProps{
                Sources = temp,
                DestinationBucket = databaseScriptsBucket
            });

            //Add database information to the lambdas
            getEmployees.AddEnvironment("RDS_ENDPOINT", database.DbInstanceEndpointAddress);
            getEmployees.AddEnvironment("RDS_PASSWORD", databasePassword.ToString());
            getEmployees.AddEnvironment("RDS_NAME", database.InstanceIdentifier);

            getEmployeeByName.AddEnvironment("RDS_ENDPOINT", database.DbInstanceEndpointAddress);
            getEmployeeByName.AddEnvironment("RDS_PASSWORD", databasePassword.ToString());
            getEmployeeByName.AddEnvironment("RDS_NAME", database.InstanceIdentifier);
            getEmployeeByName.AddEnvironment("OBJECT_KEY", "getByName.sql");
            getEmployeeByName.AddEnvironment("BUCKET_NAME",databaseScriptsBucket.BucketName);

            search.AddEnvironment("RDS_ENDPOINT", database.DbInstanceEndpointAddress);
            search.AddEnvironment("RDS_PASSWORD", databasePassword.ToString());
            search.AddEnvironment("RDS_NAME", database.InstanceIdentifier);
            search.AddEnvironment("OBJECT_KEY", "SearchTemp.sql");
            search.AddEnvironment("BUCKET_NAME",databaseScriptsBucket.BucketName);


            getEmployeeID.AddEnvironment("RDS_ENDPOINT", database.DbInstanceEndpointAddress);
            getEmployeeID.AddEnvironment("RDS_PASSWORD", databasePassword.ToString());
            getEmployeeID.AddEnvironment("RDS_NAME", database.InstanceIdentifier);
            getEmployeeID.AddEnvironment("OBJECT_KEY", "getEmployeeID.sql");
            getEmployeeID.AddEnvironment("BUCKET_NAME",databaseScriptsBucket.BucketName);

            getOrgChart.AddEnvironment("RDS_ENDPOINT", database.DbInstanceEndpointAddress);
            getOrgChart.AddEnvironment("RDS_PASSWORD", databasePassword.ToString());
            getOrgChart.AddEnvironment("RDS_NAME", database.InstanceIdentifier);
            getOrgChart.AddEnvironment("OBJECT_KEY", "orgChartEmployee.sql");
            getOrgChart.AddEnvironment("BUCKET_NAME",databaseScriptsBucket.BucketName);

            getAllFilters.AddEnvironment("RDS_ENDPOINT", database.DbInstanceEndpointAddress);
            getAllFilters.AddEnvironment("RDS_PASSWORD", databasePassword.ToString());
            getAllFilters.AddEnvironment("RDS_NAME", database.InstanceIdentifier);

            databaseInitLambda.AddEnvironment("RDS_ENDPOINT", database.DbInstanceEndpointAddress);
            databaseInitLambda.AddEnvironment("RDS_PASSWORD", databasePassword.ToString());
            databaseInitLambda.AddEnvironment("RDS_NAME", database.InstanceIdentifier);
            databaseInitLambda.AddEnvironment("OBJECT_KEY", "dbInit.sql");
            databaseInitLambda.AddEnvironment("BUCKET_NAME",databaseScriptsBucket.BucketName);

            databaseDropAllLambda.AddEnvironment("RDS_ENDPOINT", database.DbInstanceEndpointAddress);
            databaseDropAllLambda.AddEnvironment("RDS_PASSWORD", databasePassword.ToString());
            databaseDropAllLambda.AddEnvironment("RDS_NAME", database.InstanceIdentifier);
            databaseDropAllLambda.AddEnvironment("OBJECT_KEY", "DropAllTables.sql");
            databaseDropAllLambda.AddEnvironment("BUCKET_NAME",databaseScriptsBucket.BucketName);


            new CfnOutput(this, "SQLserverEndpoint", new CfnOutputProps{
                Value = database.DbInstanceEndpointAddress
            });
            
            //CfnOutput output = new CfnOutput(this, "endpoint output", new CfnOutputProps{
            //    Value = api.Url, ExportName = "gateWayURL"
            //});
        }
    }
}
