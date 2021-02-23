using System;
using System.IO;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Amazon;
using Amazon.S3;
using Amazon.S3.Model;

using Amazon.Lambda.Core;
using Amazon.Lambda.APIGatewayEvents;

using Npgsql;
using Newtonsoft.Json.Linq;

// Assembly attribute to enable the Lambda function's JSON input to be converted into a .NET class.
[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer))]

namespace Handler
{
    public class Function
    {   
        /// <summary>
        /// A simple function that takes a string and does a ToUpper
        /// </summary>
        /// <param name="input"></param>
        /// <param name="context"></param>
        /// <returns></returns>
        public string FunctionHandler(string input, ILambdaContext context)
        {
            return input?.ToUpper();
        }

        //Creates the connection string to the postgres database
        public static string GetRDSConnectionString()
        {
            LambdaLogger.Log("GettingRDSString");
            string dbname = "postgres";
            var rdsEndpoint = Environment.GetEnvironmentVariable("RDS_ENDPOINT");
            var password = Environment.GetEnvironmentVariable("RDS_PASSWORD");
            return "Host=" + rdsEndpoint + ";Username=postgres;Password=" + password + ";Database=" + dbname;
        }

        public APIGatewayProxyResponse Get(APIGatewayProxyRequest request, ILambdaContext context)
        {
            LambdaLogger.Log(GetRDSConnectionString());
            //Open the connection to the postgres database
            using var con = new NpgsqlConnection(GetRDSConnectionString());
            con.Open();

            var sql = "Select * FROM \"Employee\"";
            //Create the database sql command
            using var cmd = new NpgsqlCommand(sql, con);

            //Run the sql command
            var reader = cmd.ExecuteReader();
    
            string output = "";
            //Test to make sure it is actually getting all the rows
            while(reader.Read()){
                string row = reader[0] + ", " + reader[1];
                LambdaLogger.Log(row);
                output += row;
            }

            //TODO close connection?

            var response = new APIGatewayProxyResponse
            {
                StatusCode = 200,
                Body = output,
                //Body = myDbItems.ToString(),
                Headers = new Dictionary<string, string>
                { 
                    { "Content-Type", "application/json" }, 
                    { "Access-Control-Allow-Origin", "*" } 
                }
            };

            return response;
        }

         public APIGatewayProxyResponse GetByName(Stream input, ILambdaContext context)
        {
            string inputString = string.Empty;
            LambdaLogger.Log("Inside GetByName\n");
            LambdaLogger.Log(GetRDSConnectionString());
            //Open the connection to the postgres database

            if (input != null)
            {
                StreamReader streamReader = new StreamReader(input);
                inputString = streamReader.ReadToEnd();
            }

            LambdaLogger.Log($"GetByName: received the following string: {inputString}");

            JObject inputJSON = JObject.Parse(inputString);
            var firstName = inputJSON["FirstName"].ToString();
            var lastName = inputJSON["LastName"].ToString();
            LambdaLogger.Log($"First: {firstName}");
            LambdaLogger.Log($"Last: {lastName}");  

            using var con = new NpgsqlConnection(GetRDSConnectionString());
            con.Open();

            var sql = "Select * FROM \"Employee\" WHERE \"FirstName\" = 'Susan' AND \"LastName\" = 'Acme'";
            //Create the database sql command
            using var cmd = new NpgsqlCommand(sql, con);

            //Run the sql command
            var reader = cmd.ExecuteReader();
    
            string output = "";
            //Test to make sure it is actually getting all the rows
            while(reader.Read()){
                string row = reader[0] + ", " + reader[1];
                LambdaLogger.Log(row);
                output += row;
            }

            var response = new APIGatewayProxyResponse
            {
                StatusCode = 200,
                Body = output,
                //Body = myDbItems.ToString(),
                Headers = new Dictionary<string, string>
                { 
                    { "Content-Type", "application/json" }, 
                    { "Access-Control-Allow-Origin", "*" } 
                }
            };

            return response;
        }


        private GetObjectResponse getS3FileSync(string bucketName, string objectKey){
            //TODO get the region from an environment variable or something else
            RegionEndpoint bucketRegion = RegionEndpoint.USWest2;//region where you store your file


            //Create the S3Client
            var client = new AmazonS3Client(bucketRegion);

            //Create the request for the file from the bucket
            GetObjectRequest request = new GetObjectRequest
                {
                    BucketName = bucketName,
                    Key = objectKey
                };
            //Read the file from the bucket and wait for it to finish
            var task = client.GetObjectAsync(request);
            task.Wait();

            return task.Result;
        }

        public APIGatewayProxyResponse Init(APIGatewayProxyRequest request, ILambdaContext context)
        {
            //Open the connection to the postgres database
            using var con = new NpgsqlConnection(GetRDSConnectionString());
            con.Open();

            //Get the name of the bucket that holds the db scripts and the file that has the sql script we want.
            var bucketName = Environment.GetEnvironmentVariable("BUCKET_NAME");
            var objectKey = Environment.GetEnvironmentVariable("OBJECT_KEY");

            //Get the sql script from the bucket
            var script = getS3FileSync(bucketName, objectKey);

            //Read the sql from the file
            StreamReader reader = new StreamReader(script.ResponseStream);
            String sql = reader.ReadToEnd();
            
            //Create the database sql command
            using var cmd = new NpgsqlCommand(sql, con);

            //Execute the init sql
            cmd.ExecuteNonQuery();
            
            //TODO close connection?

            var response = new APIGatewayProxyResponse
            {
                StatusCode = 200,
                Body = "Database initialized",
                Headers = new Dictionary<string, string>
                { 
                    { "Content-Type", "application/json" }, 
                    { "Access-Control-Allow-Origin", "*" } 
                }
            };

            return response;
        }

        public APIGatewayProxyResponse dropAll(APIGatewayProxyRequest request, ILambdaContext context)
        {
            //Open the connection to the postgres database
            using var con = new NpgsqlConnection(GetRDSConnectionString());
            con.Open();

            //Get the name of the bucket that holds the db scripts and the file that has the sql script we want.
            var bucketName = Environment.GetEnvironmentVariable("BUCKET_NAME");
            var objectKey = Environment.GetEnvironmentVariable("OBJECT_KEY");

            //Get the sql script from the bucket
            var script = getS3FileSync(bucketName, objectKey);
            
            //Read the sql from the file
            StreamReader reader = new StreamReader(script.ResponseStream);
            String sql = reader.ReadToEnd();

            //Create the database sql command
            using var cmd = new NpgsqlCommand(sql, con);

            //Execute the drop all sql 
            cmd.ExecuteNonQuery();

            //TODO close connection?

            var response = new APIGatewayProxyResponse
            {
                StatusCode = 200,
                Body = "dropped all tables",
                Headers = new Dictionary<string, string>
                { 
                    { "Content-Type", "application/json" }, 
                    { "Access-Control-Allow-Origin", "*" } 
                }
            };

            return response;
        }
    }
}
