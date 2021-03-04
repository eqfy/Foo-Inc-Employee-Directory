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
using System.Collections;
using System.Text.Json;
using System.Text.Json.Serialization;

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

        public  APIGatewayProxyResponse GetByName(Stream input, ILambdaContext context)
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

            // using var cmd = new NpgsqlCommand("Select * FROM \"Employee\" WHERE \"FirstName\" = :p1 AND \"LastName\" = :p2", con);
            using var cmd = new NpgsqlCommand("WITH es AS (SELECT \"EmployeeNumber\", string_agg(\"SkillCategory\".\"Label\" || ': ' || \"Skill\".\"Label\", ', ') AS skills FROM \"EmployeeSkills\", \"Skill\", \"SkillCategory\" WHERE \"EmployeeSkills\".\"SkillId\" = \"Skill\".\"SkillId\" AND \"EmployeeSkills\".\"SkillCategoryId\" = \"SkillCategory\".\"SkillCategoryId\" AND \"Skill\".\"SkillCategoryId\" = \"SkillCategory\".\"SkillCategoryId\" GROUP BY \"EmployeeNumber\") SELECT \"Employee\".*, es.skills FROM \"Employee\" LEFT JOIN es ON \"Employee\".\"EmployeeNumber\" = es.\"EmployeeNumber\" WHERE \"Employee\".\"FirstName\" = :p1 AND \"Employee\".\"LastName\" = :p2", con);
            cmd.Parameters.AddWithValue("p1", firstName);
            cmd.Parameters.AddWithValue("p2", lastName);

            //Run the sql command
            var reader = cmd.ExecuteReader();
    
            string output = string.Empty;
            List<Employee> employees = new List<Employee>();

            while(reader.Read()) {
                Employee e = new Employee();
                e.employeeNumber = reader[0].ToString();
                e.companyCode = reader[1].ToString();
                e.officeCode = reader[2].ToString();
                e.groupCode = reader[3].ToString();
                e.lastName = reader[4].ToString();
                e.firstName = reader[5].ToString();
                e.employmentType = reader[6].ToString();
                e.title = reader[7].ToString();
                e.hireDate = reader[8].ToString();
                e.terminationDate = reader[9].ToString();
                e.supervisorEmployeeNumber = reader[10].ToString();
                e.yearsPriorExperience = reader[11].ToString();
                e.email = reader[12].ToString();
                e.workPhone = reader[13].ToString();
                e.workCell = reader[14].ToString();
                e.physicalLocation = reader[15].ToString();
                e.photoUrl = reader[16].ToString();
                e.isContractor = reader[17].ToString();
                e.skills = reader[18].ToString();
                employees.Add(e);
            }

            reader.Close();

            LambdaLogger.Log("firstName ==: " + employees[0].firstName + "\n");
            LambdaLogger.Log("employeeNumber ==: " + employees[0].employeeNumber + "\n");
            output = Newtonsoft.Json.JsonConvert.SerializeObject(employees); 
            //jsonString = Newtonsoft.Json.JsonConvert.SerializeObject(obj);
        
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

        public  APIGatewayProxyResponse GetOrgChart(APIGatewayProxyRequest request, ILambdaContext context) {
            string workerID = string.Empty;
            if (request.MultiValueQueryStringParameters.ContainsKey("WorkerID")) {
                workerID = (List<string>)request.MultiValueQueryStringParameters["WorkerID"];
            }

            using var con = new NpgsqlConnection(GetRDSConnectionString());
            con.Open();

            var bucketName = Environment.GetEnvironmentVariable("BUCKET_NAME");
            var objectKey = Environment.GetEnvironmentVariable("OBJECT_KEY");

            LambdaLogger.Log("BUCKET_NAME: " + bucketName);
            LambdaLogger.Log("OBJECT_KEY: " + objectKey);

            var script = getS3FileSync(bucketName, objectKey);

            StreamReader readers3 = new StreamReader(script.ResponseStream);
            String sql = readers3.ReadToEnd();

            // Get focusedWorker
            String sqlFocused = sql + " WHERE \"EmployeeNumber\" = :p"

            using var cmdFocused = new NpgsqlCommand(sqlFocused, con);
            cmd.Parameters.AddWithValue("p", workerID);
            var readerFocused = cmdFocused.ExecuteReader();

            string output = string.Empty;
            string supervisorID = string.Empty;
            OrgChart orgChart = new OrgChart();
            Employee focusedWorker = new Employee();

            while(reader.Read()) {
                LambdaLogger.Log("Reading self: \n");
                focusedWorker.firstName = reader[0].ToString();
                focusedWorker.lastName = reader[1].ToString();
                focusedWorker.photoUrl = reader[2].ToString();
                focusedWorker.physicalLocation = reader[3].ToString();
                focusedWorker.division = reader[4].ToString();
                focusedWorker.companyName = reader[5].ToString();
                focusedWorker.title = reader[6].ToString();
                focusedWorker.hireDate = reader[7].ToString();
                focusedWorker.terminationDate = reader[8].ToString();
                focusedWorker.supervisorEmployeeNumber = reader[9].ToString();
                focusedWorker.yearsPriorExperience = reader[10].ToString();
                focusedWorker.email = reader[11].ToString();
                focusedWorker.workPhone = reader[12].ToString();
                focusedWorker.workCell = reader[13].ToString();
                focusedWorker.isContractor = reader[14].ToString();
                focusedWorker.employeeNumber = reader[15].ToString();
                focusedWorker.employmentType = reader[16].ToString();
                focusedWorker.skills = reader[17].ToString();
                focusedWorker.OfficeLocation = reader[18].ToString();
                supervisorID = e.supervisorEmployeeNumber;
            }

            orgChart.focusedWorker = focusedWorker;
            readerFocused.Close();
            LambdaLogger.Log("firstName ==: " + employees[0].firstName + "\n");
            LambdaLogger.Log("employeeNumber ==: " + employees[0].employeeNumber + "\n");
            
            // Get supervisor
            String sqlSupervisor = sql + " WHERE \"EmployeeNumber\" = :p"

            using var cmdSupervisor = new NpgsqlCommand(sqlSupervisor, con);
            cmdSupervisor.Parameters.AddWithValue("p", supervisorID);
            var readerSupervisor = cmdSupervisor.ExecuteReader();

            Employee supervisor = new Employee();

            while(readerSupervisor.Read()) {
                LambdaLogger.Log("Reading supervisor: \n");
                supervisor.firstName = reader[0].ToString();
                supervisor.lastName = reader[1].ToString();
                supervisor.photoUrl = reader[2].ToString();
                supervisor.physicalLocation = reader[3].ToString();
                supervisor.division = reader[4].ToString();
                supervisor.companyName = reader[5].ToString();
                supervisor.title = reader[6].ToString();
                supervisor.hireDate = reader[7].ToString();
                supervisor.terminationDate = reader[8].ToString();
                supervisor.supervisorEmployeeNumber = reader[9].ToString();
                supervisor.yearsPriorExperience = reader[10].ToString();
                supervisor.email = reader[11].ToString();
                supervisor.workPhone = reader[12].ToString();
                supervisor.workCell = reader[13].ToString();
                supervisor.isContractor = reader[14].ToString();
                supervisor.employeeNumber = reader[15].ToString();
                supervisor.employmentType = reader[16].ToString();
                supervisor.skills = reader[17].ToString();
                supervisor.OfficeLocation = reader[18].ToString();
            }

            orgChart.supervisor = supervisor;
            readerSupervisor.Close();

            // Get colleagues
            String sqlColleagues = sql + " WHERE \"SupervisorEmployeeNumber\" = :p"

            using var cmdColleagues = new NpgsqlCommand(sqlColleagues, con);
            cmdColleagues.Parameters.AddWithValue("p", supervisorID);
            var readerColleagues = cmdColleagues.ExecuteReader();
            List<Employee> colleagues = new List<Employee>();

            while(readerColleagues.Read()) {
                LambdaLogger.Log("Reading colleagues: \n");
                Employee e = new Employee();
                e.firstName = reader[0].ToString();
                e.lastName = reader[1].ToString();
                e.photoUrl = reader[2].ToString();
                e.physicalLocation = reader[3].ToString();
                e.division = reader[4].ToString();
                e.companyName = reader[5].ToString();
                e.title = reader[6].ToString();
                e.hireDate = reader[7].ToString();
                e.terminationDate = reader[8].ToString();
                e.supervisorEmployeeNumber = reader[9].ToString();
                e.yearsPriorExperience = reader[10].ToString();
                e.email = reader[11].ToString();
                e.workPhone = reader[12].ToString();
                e.workCell = reader[13].ToString();
                e.isContractor = reader[14].ToString();
                e.employeeNumber = reader[15].ToString();
                e.employmentType = reader[16].ToString();
                e.skills = reader[17].ToString();
                e.OfficeLocation = reader[18].ToString();
                colleages.Add(e);
            }

            readerColleagues.Close();

            // Get subordinates
            String sqlSubordinates = sql + " WHERE \"SupervisorEmployeeNumber\" = :p"

            using var cmdSubordinates = new NpgsqlCommand(sqlSubordinates, con);
            cmdSubordinates.Parameters.AddWithValue("p", workerID);
            var readerSubordinates = cmdSubordinates.ExecuteReader();
            List<Employee> subs = new List<Employee>();

            while(readerColleagues.Read()) {
                LambdaLogger.Log("Reading subordinates: \n");
                Employee e = new Employee();
                e.firstName = reader[0].ToString();
                e.lastName = reader[1].ToString();
                e.photoUrl = reader[2].ToString();
                e.physicalLocation = reader[3].ToString();
                e.division = reader[4].ToString();
                e.companyName = reader[5].ToString();
                e.title = reader[6].ToString();
                e.hireDate = reader[7].ToString();
                e.terminationDate = reader[8].ToString();
                e.supervisorEmployeeNumber = reader[9].ToString();
                e.yearsPriorExperience = reader[10].ToString();
                e.email = reader[11].ToString();
                e.workPhone = reader[12].ToString();
                e.workCell = reader[13].ToString();
                e.isContractor = reader[14].ToString();
                e.employeeNumber = reader[15].ToString();
                e.employmentType = reader[16].ToString();
                e.skills = reader[17].ToString();
                e.OfficeLocation = reader[18].ToString();
                subs.Add(e);
            }

            orgChart.subordinates = subs;
            readerSubordinates.Close();

            output = Newtonsoft.Json.JsonConvert.SerializeObject(orgChart); 

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
