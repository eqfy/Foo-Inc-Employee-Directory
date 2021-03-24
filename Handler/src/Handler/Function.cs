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

using System.Web;

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
                    { "Access-Control-Allow-Origin", "*" },
                    { "Access-Control-Allow-Methods", "*" },
                    { "Access-Control-Allow-Headers", "*" },  
                }
            };

            return response;
        }

        public  APIGatewayProxyResponse GetByName(APIGatewayProxyRequest request, ILambdaContext context)
        {            
            var firstName = HttpUtility.UrlDecode(request.QueryStringParameters["firstName"]);
            var lastName = HttpUtility.UrlDecode(request.QueryStringParameters["lastName"]);  
            LambdaLogger.Log("FirstName: " + firstName);
            LambdaLogger.Log("lasttName: " + lastName);

            using var con = new NpgsqlConnection(GetRDSConnectionString());
            con.Open();

            
            // using var cmd = new NpgsqlCommand("Select * FROM \"Employee\" WHERE \"FirstName\" = :p1 AND \"LastName\" = :p2", con);
            //using var cmd = new NpgsqlCommand("WITH es AS (SELECT \"EmployeeNumber\", string_agg(\"SkillCategory\".\"Label\" || ': ' || \"Skill\".\"Label\", ', ') AS skills FROM \"EmployeeSkills\", \"Skill\", \"SkillCategory\" WHERE \"EmployeeSkills\".\"SkillId\" = \"Skill\".\"SkillId\" AND \"EmployeeSkills\".\"SkillCategoryId\" = \"SkillCategory\".\"SkillCategoryId\" AND \"Skill\".\"SkillCategoryId\" = \"SkillCategory\".\"SkillCategoryId\" GROUP BY \"EmployeeNumber\") SELECT \"Employee\".*, es.skills FROM \"Employee\" LEFT JOIN es ON \"Employee\".\"EmployeeNumber\" = es.\"EmployeeNumber\" WHERE \"Employee\".\"FirstName\" = :p1 AND \"Employee\".\"LastName\" = :p2", con);
            
            //Get the name of the bucket that holds the db scripts and the file that has the sql script we want.
            var bucketName = Environment.GetEnvironmentVariable("BUCKET_NAME");
            var objectKey = Environment.GetEnvironmentVariable("OBJECT_KEY");
            LambdaLogger.Log("bucketName: " + bucketName);
            LambdaLogger.Log("objectKey: " + objectKey);

            //Get the sql script from the bucket
            var script = getS3FileSync(bucketName, objectKey);
        
            
            //Read the sql from the file
            StreamReader readers3 = new StreamReader(script.ResponseStream);
            String sql = readers3.ReadToEnd();
            LambdaLogger.Log("sql: " + sql);
            
            using var cmd = new NpgsqlCommand(sql,con);
            cmd.Parameters.AddWithValue("p1", firstName);
            cmd.Parameters.AddWithValue("p2", lastName);

            //Run the sql command
            var reader = cmd.ExecuteReader();
    
            string output = string.Empty;
            List<Employee> employees = new List<Employee>();

            while(reader.Read()) {
                Employee e = new Employee();
                // e.companyCode = reader[1].ToString();
                // e.officeCode = reader[2].ToString();
                // e.groupCode = reader[3].ToString();
                e.firstName = reader[0].ToString();
                e.lastName = reader[1].ToString();
                e.image = reader[2].ToString();
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
                e.isContractor = System.Convert.ToBoolean(reader[14].ToString());
                e.employeeNumber = reader[15].ToString();
                e.employmentType = reader[16].ToString();
                e.skills = reader[17].ToString();
                e.officeLocation = reader[18].ToString();
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
                    { "Access-Control-Allow-Origin", "*" },
                    { "Access-Control-Allow-Methods", "*" },
                    { "Access-Control-Allow-Headers", "*" },  
                }
            };

            return response;
        }

        public APIGatewayProxyResponse predictiveSearch(APIGatewayProxyRequest request, ILambdaContext context)
        {
            Dictionary<string, string> headers = new Dictionary<string, string>
                        {
                            { "Content-Type", "application/json" },
                            { "Access-Control-Allow-Origin", "*" },
                            { "Access-Control-Allow-Methods", "*" },
                            { "Access-Control-Allow-Headers", "*" },
                        };
            try
            {
                var firstNamePrefix = HttpUtility.UrlDecode(request.QueryStringParameters["firstName"].ToLower());
                var lastNamePrefix = HttpUtility.UrlDecode(request.QueryStringParameters["lastName"].ToLower());

                LambdaLogger.Log("firstName: " + firstNamePrefix);
                LambdaLogger.Log("lastName: " + lastNamePrefix);

                var appendSql = string.Empty;

                LambdaLogger.Log(GetRDSConnectionString());
                //Open the connection to the postgres database
                using var con = new NpgsqlConnection(GetRDSConnectionString());
                con.Open();

                var bucketName = Environment.GetEnvironmentVariable("BUCKET_NAME");
                var objectKey = Environment.GetEnvironmentVariable("OBJECT_KEY");
                LambdaLogger.Log("bucketName: " + bucketName);
                LambdaLogger.Log("objectKey: " + objectKey);

                //Get the sql script from the bucket
                var script = getS3FileSync(bucketName, objectKey);


                //Read the sql from the file
                StreamReader readers3 = new StreamReader(script.ResponseStream);
                String sql = readers3.ReadToEnd();

                if (firstNamePrefix != string.Empty && lastNamePrefix != string.Empty)
                {
                    sql += " WHERE LOWER(\"FirstName\") LIKE :p1 AND LOWER(\"LastName\") LIKE :p2 LIMIT 20";
                }
                else
                {
                    sql += " WHERE (LOWER(\"FirstName\") LIKE :p1 AND LOWER(\"LastName\") LIKE :p2) OR (LOWER(\"FirstName\") LIKE :p2 AND LOWER(\"LastName\") LIKE :p1) LIMIT 20";
                }

                LambdaLogger.Log("sql: " + sql);

                using var cmd = new NpgsqlCommand(sql, con);
                cmd.Parameters.AddWithValue("p1", firstNamePrefix + "%");
                cmd.Parameters.AddWithValue("p2", lastNamePrefix + "%");

                //Run the sql command
                string output = string.Empty;
                List<PredictiveSearchEmployee> predEmployees = new List<PredictiveSearchEmployee>();


                var reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    PredictiveSearchEmployee e = new PredictiveSearchEmployee();

                    e.firstName = reader[0].ToString();
                    e.lastName = reader[1].ToString();
                    e.imageURL = reader[2].ToString();
                    e.employeeNumber = reader[3].ToString();

                    predEmployees.Add(e);
                }
                reader.Close();

                output = Newtonsoft.Json.JsonConvert.SerializeObject(predEmployees);

                var response = new APIGatewayProxyResponse
                {
                    StatusCode = 200,
                    Body = output,
                    Headers = headers
                };

                return response;

            }
            catch (System.Collections.Generic.KeyNotFoundException error)
            {
                return new APIGatewayProxyResponse
                {
                    StatusCode = 400,
                    Body = "Bad Request. Missing query parameter : " + error,
                    Headers = headers
                };
            }
            catch (System.NullReferenceException error)
            {
                return new APIGatewayProxyResponse
                {
                    StatusCode = 400,
                    Body = "Bad request : No query parameters sent : " + error,
                    Headers = headers
                };
            }
            catch (System.Exception error)
            {
                return new APIGatewayProxyResponse
                {
                    StatusCode = 404,
                    Body = "Generic Error: " + error,
                    Headers = headers
                };
            }
        }

        public  APIGatewayProxyResponse GetOrgChart(APIGatewayProxyRequest request, ILambdaContext context) {
            string workerID = HttpUtility.UrlDecode(request.QueryStringParameters["WorkerID"]);//request.QueryStringParameters["WorkerID"];
            string CeoID = "10001";

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
            String sqlFocused = sql + " WHERE ed.\"EmployeeNumber\" = :p";

            using var cmdFocused = new NpgsqlCommand(sqlFocused, con);
            cmdFocused.Parameters.AddWithValue("p", workerID);
            var readerFocused = cmdFocused.ExecuteReader();

            string output = string.Empty;
            string supervisorID = string.Empty;
            OrgChart orgChart = new OrgChart();
            string focusedWorker = string.Empty;
            bool toggleIsEmpty = true;

            while(readerFocused.Read()) {
                if (toggleIsEmpty == true) {
                  toggleIsEmpty = false;
                }
                LambdaLogger.Log("Reading self: \n");
                focusedWorker = readerFocused[15].ToString();
                supervisorID = readerFocused[9].ToString();
            }

            if (toggleIsEmpty) {
              orgChart.focusedWorker = null;
            } else {
              orgChart.focusedWorker = focusedWorker;
            }
            
            readerFocused.Close();
            toggleIsEmpty = true;

            // Get supervisor
            String sqlSupervisor = sql + " WHERE ed.\"EmployeeNumber\" = :p";

            using var cmdSupervisor = new NpgsqlCommand(sqlSupervisor, con);
            cmdSupervisor.Parameters.AddWithValue("p", supervisorID);
            var readerSupervisor = cmdSupervisor.ExecuteReader();

            Employee supervisor = new Employee();
            

            while(readerSupervisor.Read()) {
                if (toggleIsEmpty == true) {
                  toggleIsEmpty = false;
                }
                LambdaLogger.Log("Reading supervisor: \n");
                supervisor.firstName = readerSupervisor[0].ToString();
                supervisor.lastName = readerSupervisor[1].ToString();
                supervisor.image = readerSupervisor[2].ToString();
                supervisor.physicalLocation = readerSupervisor[3].ToString();
                supervisor.division = readerSupervisor[4].ToString();
                supervisor.companyName = readerSupervisor[5].ToString();
                supervisor.title = readerSupervisor[6].ToString();
                supervisor.hireDate = readerSupervisor[7].ToString();
                supervisor.terminationDate = readerSupervisor[8].ToString();
                supervisor.supervisorEmployeeNumber = readerSupervisor[9].ToString();
                supervisor.yearsPriorExperience = readerSupervisor[10].ToString();
                supervisor.email = readerSupervisor[11].ToString();
                supervisor.workPhone = readerSupervisor[12].ToString();
                supervisor.workCell = readerSupervisor[13].ToString();
                supervisor.isContractor = System.Convert.ToBoolean(readerSupervisor[14].ToString());
                supervisor.employeeNumber = readerSupervisor[15].ToString();
                supervisor.employmentType = readerSupervisor[16].ToString();
                supervisor.skills = readerSupervisor[17].ToString();
                supervisor.officeLocation = readerSupervisor[18].ToString();
            }

            if (toggleIsEmpty || workerID == CeoID) {
              orgChart.supervisor = null;
            } else {
              orgChart.supervisor = supervisor;
            }
            
            readerSupervisor.Close();

            // Get colleagues
            String sqlColleagues = sql + " WHERE ed.\"SupervisorEmployeeNumber\" = :p ORDER BY ed.\"EmployeeNumber\"";

            using var cmdColleagues = new NpgsqlCommand(sqlColleagues, con);
            cmdColleagues.Parameters.AddWithValue("p", supervisorID);
            var readerColleagues = cmdColleagues.ExecuteReader();
            List<Employee> colleagues = new List<Employee>();
            List<Employee> ceo = new List<Employee>();

            while(readerColleagues.Read()) {
                LambdaLogger.Log("Reading colleagues: \n");
                Employee e = new Employee();
                e.firstName = readerColleagues[0].ToString();
                e.lastName = readerColleagues[1].ToString();
                e.image = readerColleagues[2].ToString();
                e.physicalLocation = readerColleagues[3].ToString();
                e.division = readerColleagues[4].ToString();
                e.companyName = readerColleagues[5].ToString();
                e.title = readerColleagues[6].ToString();
                e.hireDate = readerColleagues[7].ToString();
                e.terminationDate = readerColleagues[8].ToString();
                e.supervisorEmployeeNumber = readerColleagues[9].ToString();
                e.yearsPriorExperience = readerColleagues[10].ToString();
                e.email = readerColleagues[11].ToString();
                e.workPhone = readerColleagues[12].ToString();
                e.workCell = readerColleagues[13].ToString();
                e.isContractor = System.Convert.ToBoolean(readerColleagues[14].ToString());
                e.employeeNumber = readerColleagues[15].ToString();
                e.employmentType = readerColleagues[16].ToString();
                e.skills = readerColleagues[17].ToString();
                e.officeLocation = readerColleagues[18].ToString(); 
                if (e.employeeNumber == CeoID) {
                  ceo.Add(e);
                } else {
                  colleagues.Add(e);
                }
            }

            if (workerID == CeoID) {
              orgChart.colleagues = ceo;
            } else {
              orgChart.colleagues = colleagues;
            }
            
            readerColleagues.Close();

            // Get subordinates
            String sqlSubordinates = sql + " WHERE ed.\"SupervisorEmployeeNumber\" = :p ORDER BY ed.\"EmployeeNumber\"";

            using var cmdSubordinates = new NpgsqlCommand(sqlSubordinates, con);
            cmdSubordinates.Parameters.AddWithValue("p", workerID);
            var readerSubordinates = cmdSubordinates.ExecuteReader();
            List<Employee> subs = new List<Employee>();

            while(readerSubordinates.Read()) {
                LambdaLogger.Log("Reading subordinates: \n");
                Employee e = new Employee();
                e.firstName = readerSubordinates[0].ToString();
                e.lastName = readerSubordinates[1].ToString();
                e.image = readerSubordinates[2].ToString();
                e.physicalLocation = readerSubordinates[3].ToString();
                e.division = readerSubordinates[4].ToString();
                e.companyName = readerSubordinates[5].ToString();
                e.title = readerSubordinates[6].ToString();
                e.hireDate = readerSubordinates[7].ToString();
                e.terminationDate = readerSubordinates[8].ToString();
                e.supervisorEmployeeNumber = readerSubordinates[9].ToString();
                e.yearsPriorExperience = readerSubordinates[10].ToString();
                e.email = readerSubordinates[11].ToString();
                e.workPhone = readerSubordinates[12].ToString();
                e.workCell = readerSubordinates[13].ToString();
                e.isContractor = System.Convert.ToBoolean(readerSubordinates[14].ToString());
                e.employeeNumber = readerSubordinates[15].ToString();
                e.employmentType = readerSubordinates[16].ToString();
                e.skills = readerSubordinates[17].ToString();
                e.officeLocation = readerSubordinates[18].ToString();
                if (e.employeeNumber != CeoID) {
                  subs.Add(e);
                }
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
                    { "Access-Control-Allow-Origin", "*" },
                    { "Access-Control-Allow-Methods", "*" },
                    { "Access-Control-Allow-Headers", "*" },  
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

            LambdaLogger.Log("sql: " + sql);
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
                    { "Access-Control-Allow-Origin", "*" },
                    { "Access-Control-Allow-Methods", "*" },
                    { "Access-Control-Allow-Headers", "*" },  
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

            LambdaLogger.Log("sql: " + sql);
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
                    { "Access-Control-Allow-Origin", "*" },
                    { "Access-Control-Allow-Methods", "*" },
                    { "Access-Control-Allow-Headers", "*" },  
                }
            };

            return response;
        }


        private String createSkillFilter(List<string> skills, ref int parameterCounter){
            //TODO fill in
            
            String skillFilter = "";
            
            for (int i = 0; i < skills.Count; i++ ){
                //  if (i == skills.Count){
                //     sillFilter += "ed.\"Skills\" = :p"+parameterCounter;
                // }else {
                    skillFilter += " es.\"skills\" LIKE :p"+parameterCounter +  " AND";
                    parameterCounter++;
                //}
                //es.skills LIKE '%Accounting:::Transaction Processing%' AND es.skills LIKE '%Accounting:::Reconciling%' 
            }
            return skillFilter;
        }

        private string createLocationsFilter(List<string> locations, ref int parameterCounter){
            string locationFilter = " ed.\"location\" IN ( ";
            for(int i = 0; i < locations.Count; i++){
                if(i > 0){
                    locationFilter += " , ";
                }
                locationFilter += ":p"+parameterCounter++;
            }

            locationFilter += ") AND";
            return locationFilter;
        }

        private string createTitlesFilter(List<string> titles, ref int parameterCounter){
            string titleFilter = " ed.\"Title\" IN ( ";
            for(int i = 0; i < titles.Count; i++){
                if(i > 0){
                    titleFilter += " , ";
                }
                titleFilter += ":p"+parameterCounter++;
            }

            titleFilter += ") AND";
            return titleFilter;
        }
        
        private string createYearsPriorFilter(ref int parameterCounter){
            string yearsPriorFilter = "";
            
            yearsPriorFilter = " ed.\"YearsPriorExperience\" >= :p" + parameterCounter++;

            yearsPriorFilter += " AND";
            return yearsPriorFilter;
        }

        private string createDivisionsFilter(List<string> divisions, ref int parameterCounter){
            string divisionFilter = " ed.\"division\" IN ( ";
            for(int i = 0; i < divisions.Count; i++){
                if(i > 0){
                    divisionFilter += " , ";
                }
                divisionFilter += ":p"+parameterCounter++;
            }

            divisionFilter += ") AND";
            return divisionFilter;
        }

        private string createCompanyNamesFilter(List<string> companynames, ref int parameterCounter){
            string companynameFilter = " ed.\"companyname\" IN ( ";
            for(int i = 0; i < companynames.Count; i++){
                if(i > 0){
                    companynameFilter += " , ";
                }
                companynameFilter += ":p"+parameterCounter++;
            }

            companynameFilter += ") AND";
            return companynameFilter;
        }

        private string createFirstNamesFilter(List<string> firstnames, ref int parameterCounter){
            string firstnameFilter = " ed.\"FirstName\" IN ( ";
            for(int i = 0; i < firstnames.Count; i++){
                if(i > 0){
                    firstnameFilter += " , ";
                }
                firstnameFilter += ":p"+parameterCounter++;
            }

            firstnameFilter += ") AND";
            return firstnameFilter;
        }

        private string createLastNamesFilter(List<string> lastnames, ref int parameterCounter){
            string lastnameFilter = " ed.\"LastName\" IN ( ";
            for(int i = 0; i < lastnames.Count; i++){
                if(i > 0){
                    lastnameFilter += " , ";
                }
                lastnameFilter += ":p"+parameterCounter++;
            }

            lastnameFilter += ") AND";
            return lastnameFilter;
        }

        private string createEmploymentTypesFilter(List<string> employementTypes, ref int parameterCounter){
            string employmentTypesFilter = " ed.\"EmploymentType\" IN ( ";
            for(int i = 0; i < employementTypes.Count; i++){
                if(i > 0){
                    employmentTypesFilter += " , ";
                }
                employmentTypesFilter += ":p"+parameterCounter++;
            }

            employmentTypesFilter += ") AND";
            return employmentTypesFilter;
        }

        private string createOfficeLocationsFilter(List<string> officeLocations, ref int parameterCounter){
            string officeLocationsFilter = "";
            for(int i = 0; i < officeLocations.Count; i++){
                officeLocationsFilter += " ol.\"officelocations\" LIKE :p"+parameterCounter +  " AND";
                parameterCounter++;
            }
            return officeLocationsFilter;
        }

        private string createShownWorkerTypeFilter(string shownWorkerType){
            string shownWorkerTypeFilter="";
            switch (shownWorkerType)
            {
                case "all":
                    break;
                case "contractor":
                    shownWorkerTypeFilter = " ed.\"isContractor\" = true" + " AND";
                    break;
                case "employee": 
                    shownWorkerTypeFilter = " ed.\"isContractor\" = false" + " AND";
                    break;
                default:
                    break;
            }
            
            return shownWorkerTypeFilter;
        }
        
         // order by number, offset, and fecth functions
        
        //TODO make this not case sensitive and give errors when using something like blah 
        private string createOrderByFilter(string order){
            string orderByFilter ="";
            if(order == "firstName"){
                orderByFilter = " ORDER BY \"FirstName\"";
            } else if(order == "lastName"){
                orderByFilter = " ORDER BY \"LastName\"";

            }else if(order == "title"){
                orderByFilter = " ORDER BY \"Title\"";
            }
            //throw expection TODO
            return orderByFilter;
        }
        
        private string createOrderDirFilter(string orderDir){
            string orderDirFilter = "";

            if(orderDir == "ASC"){
                orderDirFilter = " ASC";
            } else if(orderDir == "DESC"){
                orderDirFilter = " DESC";

            }
            //throw expection TODO
            return orderDirFilter;
        }
        
        private string createOffsetFilter(ref int parameterCounter){
            string offsetFilter = " OFFSET :p"+parameterCounter++;
            return offsetFilter;
        }

        private string createFetchFilter(ref int parameterCounter){
            string fetchFilter = " FETCH NEXT :p"+parameterCounter++ + " ROWS ONLY";
            return fetchFilter;
        }

        public APIGatewayProxyResponse GetAllFilters(APIGatewayProxyRequest request, ILambdaContext context)
        {
            LambdaLogger.Log(GetRDSConnectionString());
            using var con = new NpgsqlConnection(GetRDSConnectionString());
            con.Open();


            //TODO SQL in file maybe
            var sqlSkill = "WITH category AS (SELECT \"SkillCategory\".\"Label\", \"SkillCategory\".\"SkillCategoryId\" FROM \"SkillCategory\") SELECT \"Skill\".\"Label\", category.\"Label\" FROM \"Skill\" JOIN category ON \"Skill\".\"SkillCategoryId\" = category.\"SkillCategoryId\"";
            using var cmdSkill = new NpgsqlCommand(sqlSkill, con);

            var readerSkill = cmdSkill.ExecuteReader();
            Filters filters = new Filters();
            List<Skill> skills = new List<Skill>();

            while(readerSkill.Read()){
                Skill s = new Skill();
                s.skillLabel = readerSkill[0].ToString();
                s.categoryLabel = readerSkill[1].ToString();
                LambdaLogger.Log("Skill: " + s.skillLabel + "\n");
                skills.Add(s);
            }

            filters.skills = skills;
            readerSkill.Close();

            var sqlLocation = "SELECT \"Label\" FROM \"LocationPhysical\"";
            using var cmdLocation = new NpgsqlCommand(sqlLocation, con);

            var readerLocation = cmdLocation.ExecuteReader();
            List<string> locs = new List<string>();

            while (readerLocation.Read()) {
              LambdaLogger.Log("Location: " + readerLocation[0] + "\n");
              locs.Add(readerLocation[0].ToString());
            }

            filters.locations = locs;
            readerLocation.Close();

            var sqlTitle = "SELECT DISTINCT \"Employee\".\"Title\" FROM \"Employee\"";
            using var cmdTitle = new NpgsqlCommand(sqlTitle, con);

            var readerTitle = cmdTitle.ExecuteReader();
            List<string> titles = new List<string>();

            while (readerTitle.Read()) {
              LambdaLogger.Log("Title: " + readerTitle[0] + "\n");
              titles.Add(readerTitle[0].ToString());
            }

            filters.titles = titles;
            readerTitle.Close();

            var sqlDept = "SELECT DISTINCT \"Label\" FROM \"LocationGroup\"";
            using var cmdDept = new NpgsqlCommand(sqlDept, con);

            var readerDept = cmdDept.ExecuteReader();
            List<string> depts = new List<string>();

            while (readerDept.Read()) {
              LambdaLogger.Log("Dept: " + readerDept[0] + "\n");
              depts.Add(readerDept[0].ToString());
            }

            filters.departments = depts;
            readerDept.Close();

            var sqlCoy = "SELECT \"Label\" FROM \"LocationCompany\"";
            using var cmdCoy = new NpgsqlCommand(sqlCoy, con);

            var readerCoy = cmdCoy.ExecuteReader();
            List<string> coys = new List<string>();

            while (readerCoy.Read()) {
              LambdaLogger.Log("Coy: " + readerCoy[0] + "\n");
              coys.Add(readerCoy[0].ToString());
            }

            filters.companies = coys;
            readerCoy.Close();

            string output = Newtonsoft.Json.JsonConvert.SerializeObject(filters); 

            var response = new APIGatewayProxyResponse
            {
                StatusCode = 200,
                Body = output,
                Headers = new Dictionary<string, string>
                { 
                    { "Content-Type", "application/json" }, 
                    { "Access-Control-Allow-Origin", "*" } 
                }
            };

            return response;
        }

        public  APIGatewayProxyResponse search(APIGatewayProxyRequest request, ILambdaContext context)
        {
            try{
                int parameterCounter = 0;

                List<string> skills = new List<string>();
                if(request.MultiValueQueryStringParameters.ContainsKey("skills")){
                    skills = (List<string>)request.MultiValueQueryStringParameters["skills"];
                    for(int i = 0; i < skills.Count; i++){
                        skills[i] = HttpUtility.UrlDecode(skills[i]);
                    }
                }
                List<string> locations = new List<string>();
                if (request.MultiValueQueryStringParameters.ContainsKey("locationPhysical")){
                    locations = (List<string>)request.MultiValueQueryStringParameters["locationPhysical"];
                    for(int i = 0; i < locations.Count; i++){
                        locations[i] = HttpUtility.UrlDecode(locations[i]);
                    }
                }
                List<string> titles = new List<string>();
                if(request.MultiValueQueryStringParameters.ContainsKey("title")){
                    titles = (List<string>)request.MultiValueQueryStringParameters["title"];
                    for(int i = 0; i < titles.Count; i++){
                        titles[i] = HttpUtility.UrlDecode(titles[i]);
                    }
                }
                
                // Note: if they change the slide bar to allow for partial years change this to a float
                List<string> yearsExperience = new List<string>();
                if(request.MultiValueQueryStringParameters.ContainsKey("yearsPriorExperience")){
                    yearsExperience = (List<string>)request.MultiValueQueryStringParameters["yearsPriorExperience"];
                    for(int i = 0; i < yearsExperience.Count; i++){
                        yearsExperience[i] = HttpUtility.UrlDecode(yearsExperience[i]);
                    }
                }

                List<string> divisions = new List<string>();
                if(request.MultiValueQueryStringParameters.ContainsKey("division")){
                    divisions = (List<string>)request.MultiValueQueryStringParameters["division"];
                    for(int i = 0; i < divisions.Count; i++){
                        divisions[i] = HttpUtility.UrlDecode(divisions[i]);
                    }
                }
                List<string> companynames = new List<string>();
                if(request.MultiValueQueryStringParameters.ContainsKey("companyName")){
                    companynames = (List<string>)request.MultiValueQueryStringParameters["companyName"];
                    for(int i = 0; i < companynames.Count; i++){
                        companynames[i] = HttpUtility.UrlDecode(companynames[i]);
                    }
                }
                List<string> firstnames = new List<string>();
                if(request.MultiValueQueryStringParameters.ContainsKey("firstName")){
                    firstnames = (List<string>)request.MultiValueQueryStringParameters["firstName"];
                    for(int i = 0; i < firstnames.Count; i++){
                        firstnames[i] = HttpUtility.UrlDecode(firstnames[i]);
                    }
                }
                List<string> lastnames = new List<string>();
                if(request.MultiValueQueryStringParameters.ContainsKey("lastName")){
                    lastnames = (List<string>)request.MultiValueQueryStringParameters["lastName"];
                    for(int i = 0; i < lastnames.Count; i++){
                        lastnames[i] = HttpUtility.UrlDecode(lastnames[i]);
                    }
                }
                List<string> employementTypes = new List<string>();
                if(request.MultiValueQueryStringParameters.ContainsKey("employmentType")){
                    employementTypes = (List<string>)request.MultiValueQueryStringParameters["employmentType"];
                    for(int i = 0; i < employementTypes.Count; i++){
                        employementTypes[i] = HttpUtility.UrlDecode(employementTypes[i]);
                    }
                }
                List<string> officeLocations = new List<string>();
                if(request.MultiValueQueryStringParameters.ContainsKey("officeLocations")){
                    officeLocations = (List<string>)request.MultiValueQueryStringParameters["officeLocations"];
                    for(int i = 0; i < officeLocations.Count; i++){
                        officeLocations[i] = HttpUtility.UrlDecode(officeLocations[i]);
                    }
                }
                List<string> shownWorkerType = new List<string>();
                if(request.MultiValueQueryStringParameters.ContainsKey("shownWorkerType")){
                    shownWorkerType = (List<string>)request.MultiValueQueryStringParameters["shownWorkerType"];
                    for(int i = 0; i < shownWorkerType.Count; i++){
                        shownWorkerType[i] = HttpUtility.UrlDecode(shownWorkerType[i]);
                    }
                }
                List<string> orderBys = new List<string>();
                if(request.MultiValueQueryStringParameters.ContainsKey("orderBy")){
                    orderBys = (List<string>)request.MultiValueQueryStringParameters["orderBy"];
                    for(int i = 0; i < orderBys.Count; i++){
                        orderBys[i] = HttpUtility.UrlDecode(orderBys[i]);
                    }
                }
                List<string> offsets = new List<string>();
                if(request.MultiValueQueryStringParameters.ContainsKey("offset")){
                    offsets = (List<string>)request.MultiValueQueryStringParameters["offset"];
                    for(int i = 0; i < offsets.Count; i++){
                        offsets[i] = HttpUtility.UrlDecode(offsets[i]);
                    }
                }
                List<string> fetchs = new List<string>();
                if(request.MultiValueQueryStringParameters.ContainsKey("fetch")){
                    fetchs = (List<string>)request.MultiValueQueryStringParameters["fetch"];
                    for(int i = 0; i < fetchs.Count; i++){
                        fetchs[i] = HttpUtility.UrlDecode(fetchs[i]);
                    }
                }
                List<string> orderDir = new List<string>();
                if(request.MultiValueQueryStringParameters.ContainsKey("orderDir")){
                    orderDir = (List<string>)request.MultiValueQueryStringParameters["orderDir"];
                    for(int i = 0; i < orderDir.Count; i++){
                        orderDir[i] = HttpUtility.UrlDecode(orderDir[i]);
                    }
                }

                string skillFilter="";
                if(skills.Count > 0){
                    skillFilter = createSkillFilter(skills,ref parameterCounter);
                }

                string locationsFilter="";
                if(locations.Count > 0){
                    locationsFilter = createLocationsFilter(locations,ref parameterCounter);
                }

                string titlesFilter="";
                if(titles.Count > 0){
                    titlesFilter = createTitlesFilter(titles,ref parameterCounter);
                }

                string yearsPriorFilter="";
                if(yearsExperience.Count > 0){
                    yearsPriorFilter = createYearsPriorFilter(ref parameterCounter);
                }

                string divisionsFilter ="";
                if(divisions.Count > 0){
                    divisionsFilter = createDivisionsFilter(divisions, ref parameterCounter);
                }

                string companyNamesFilter ="";
                if(companynames.Count > 0){
                    companyNamesFilter = createCompanyNamesFilter(companynames, ref parameterCounter);
                }

                string firstNamesFilter ="";
                if(firstnames.Count > 0){
                    firstNamesFilter = createFirstNamesFilter(firstnames, ref parameterCounter);
                }

                string lastNamesFilter ="";
                if(lastnames.Count > 0){
                    lastNamesFilter = createLastNamesFilter(lastnames, ref parameterCounter);
                }

                string employmentTypesFilter ="";
                if(employementTypes.Count > 0){
                    employmentTypesFilter = createEmploymentTypesFilter(employementTypes, ref parameterCounter);
                }

                string officeLocationsFilter ="";
                if(officeLocations.Count > 0){
                    officeLocationsFilter = createOfficeLocationsFilter(officeLocations, ref parameterCounter);
                }
                
                string shownWorkerTypeFilter ="";
                if(shownWorkerType.Count > 0){
                    shownWorkerTypeFilter = createShownWorkerTypeFilter(shownWorkerType[0]);
                }
                
                string orderByFilter ="";
                if(orderBys.Count > 0){
                    orderByFilter = createOrderByFilter(orderBys[0]);
                }
                string orderDirFilter ="";
                if(orderDir.Count > 0){
                    orderDirFilter = createOrderDirFilter(orderDir[0]);
                }
                
                string offsetFilter ="";
                if(offsets.Count > 0){
                    offsetFilter = createOffsetFilter(ref parameterCounter);
                }

                string fetchFilter ="";
                if(fetchs.Count > 0){
                    fetchFilter = createFetchFilter(ref parameterCounter);
                }

                using var con = new NpgsqlConnection(GetRDSConnectionString());
                con.Open();


                //Get the name of the bucket that holds the db scripts and the file that has the sql script we want.
                var bucketName = Environment.GetEnvironmentVariable("BUCKET_NAME");
                var objectKey = Environment.GetEnvironmentVariable("OBJECT_KEY");
                LambdaLogger.Log("bucketName: " + bucketName);
                LambdaLogger.Log("objectKey: " + objectKey);

                //Get the sql script from the bucket
                var script = getS3FileSync(bucketName, objectKey);
                var scriptForCount = getS3FileSync(bucketName, "searchTempCount.sql");
            
                
                //Read the sql from the file
                StreamReader readers3 = new StreamReader(script.ResponseStream);
                String sql = readers3.ReadToEnd();
                //Read SQL from file for the search count
                StreamReader readers3Count = new StreamReader(scriptForCount.ResponseStream);
                String sqlForCount = readers3Count.ReadToEnd();

                //TODO add all the different filter strings here
                if(skillFilter.Length > 0 || locationsFilter.Length > 0 || titlesFilter.Length > 0 || yearsPriorFilter.Length > 0 || divisionsFilter.Length >0 
                || companyNamesFilter.Length >0 || firstNamesFilter.Length >0 || lastNamesFilter.Length >0 || employmentTypesFilter.Length >0 || 
                officeLocationsFilter.Length>0 || shownWorkerTypeFilter.Length>0){
                    sql += " WHERE ";

                    sql += skillFilter;
                    sql += locationsFilter;
                    sql += titlesFilter; 
                    sql += yearsPriorFilter;
                    sql += divisionsFilter;
                    sql += companyNamesFilter;
                    sql += firstNamesFilter;
                    sql += lastNamesFilter;
                    sql += employmentTypesFilter;
                    sql += officeLocationsFilter;
                    sql += shownWorkerTypeFilter;
                    //TODO add the rest of the filters here

                    //Remove the last 'AND' from the sql string
                    sql = sql.Remove(sql.Length - 3);

                    sqlForCount += " WHERE ";

                    sqlForCount += skillFilter;
                    sqlForCount += locationsFilter;
                    sqlForCount += titlesFilter; 
                    sqlForCount += yearsPriorFilter;
                    sqlForCount += divisionsFilter;
                    sqlForCount += companyNamesFilter;
                    sqlForCount += firstNamesFilter;
                    sqlForCount += lastNamesFilter;
                    sqlForCount += employmentTypesFilter;
                    sqlForCount += officeLocationsFilter;
                    sqlForCount += shownWorkerTypeFilter;
                    //TODO add the rest of the filters here

                    //Remove the last 'AND' from the sql string
                    sqlForCount = sqlForCount.Remove(sqlForCount.Length - 3);
                }
                
                //Add the order by, filter, and offset TODO do it! and TODO potentially order on multiple
                sql += orderByFilter;
                //Only add the fetch and offset filters if there is an orderBy
                if(orderBys.Count > 0){
                    sql += orderDirFilter;
                    sql += offsetFilter;
                    sql += fetchFilter;
                }
                
                LambdaLogger.Log("sql: " + sql);

                LambdaLogger.Log("sqlForCount: " + sqlForCount);
            
                using var cmd = new NpgsqlCommand(sql,con);

                int currentParameterCounter = 0;
                //Add the bind variables
                foreach(string skill in skills){
                    LambdaLogger.Log("p"+currentParameterCounter + " : " + "%"+skill+"%");
                    cmd.Parameters.AddWithValue("p"+currentParameterCounter++, "%"+skill+"%");
                }
                foreach(string location in locations){
                    LambdaLogger.Log("p"+currentParameterCounter + " : " + location);
                    cmd.Parameters.AddWithValue("p"+currentParameterCounter++, location);
                }
                foreach(string title in titles){
                    LambdaLogger.Log("p"+currentParameterCounter + " : " + title);
                    cmd.Parameters.AddWithValue("p"+currentParameterCounter++, title);
                }
                foreach(string yearsPrior in yearsExperience){
                    LambdaLogger.Log("p"+currentParameterCounter + " : " + yearsPrior);
                    cmd.Parameters.AddWithValue("p"+currentParameterCounter++, float.Parse(yearsPrior));
                }

                foreach(string division in divisions){
                    LambdaLogger.Log("p"+currentParameterCounter + " : " + division);
                    cmd.Parameters.AddWithValue("p"+currentParameterCounter++, division);
                }

                foreach(string companyname in companynames){
                    LambdaLogger.Log("p"+currentParameterCounter + " : " + companyname);
                    cmd.Parameters.AddWithValue("p"+currentParameterCounter++, companyname);
                }

                foreach(string firstname in firstnames){
                    LambdaLogger.Log("p"+currentParameterCounter + " : " + firstname);
                    cmd.Parameters.AddWithValue("p"+currentParameterCounter++, firstname);
                }

                foreach(string lastname in lastnames){
                    LambdaLogger.Log("p"+currentParameterCounter + " : " + lastname);
                    cmd.Parameters.AddWithValue("p"+currentParameterCounter++, lastname);
                }

                foreach(string employementType in employementTypes){
                    LambdaLogger.Log("p"+currentParameterCounter + " : " + employementType);
                    cmd.Parameters.AddWithValue("p"+currentParameterCounter++, employementType);
                }

                foreach(string officeLocation in officeLocations){
                    LambdaLogger.Log("p"+currentParameterCounter + " : " + officeLocation);
                    cmd.Parameters.AddWithValue("p"+currentParameterCounter++, "%"+officeLocation+"%");
                }

                foreach(string offset in offsets){
                    LambdaLogger.Log("p"+currentParameterCounter + " : " + offset);
                    cmd.Parameters.AddWithValue("p"+currentParameterCounter++, int.Parse(offset));
                }

                foreach(string fetch in fetchs){
                    LambdaLogger.Log("p"+currentParameterCounter + " : " + fetch);
                    cmd.Parameters.AddWithValue("p"+currentParameterCounter++, int.Parse(fetch));
                }

                //TODO: is contractor, hiredate, termination date
                //Done: DIVISION, companyname, lastname, firstname. employment type and office location 

                //Run the sql command
                var reader = cmd.ExecuteReader();
        
                string output = string.Empty;
                List<Employee> employees = new List<Employee>();
                //LambdaLogger.Log("Hey1"+ reader.Read().ToString());

                while(reader.Read()) {
                    //LambdaLogger.Log("Hey"+ reader[0].ToString());
                    Employee e = new Employee();
                    e.firstName = reader[0].ToString();
                    e.lastName = reader[1].ToString();
                    e.image = reader[2].ToString();
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
                    e.isContractor = System.Convert.ToBoolean(reader[14].ToString());
                    e.employeeNumber = reader[15].ToString();
                    e.employmentType = reader[16].ToString();
                    e.skills = reader[17].ToString();
                    e.officeLocation = reader[18].ToString();
                    employees.Add(e);
                }

                reader.Close();


                //Run the SQL to get the count of how many workers satisfy the query
                using var cmd2 = new NpgsqlCommand(sqlForCount,con);

                currentParameterCounter = 0;
                //Add the bind variables
                foreach(string skill in skills){
                    LambdaLogger.Log("p"+currentParameterCounter + " : " + "%"+skill+"%");
                    cmd2.Parameters.AddWithValue("p"+currentParameterCounter++, "%"+skill+"%");
                }
                foreach(string location in locations){
                    LambdaLogger.Log("p"+currentParameterCounter + " : " + location);
                    cmd2.Parameters.AddWithValue("p"+currentParameterCounter++, location);
                }
                foreach(string title in titles){
                    LambdaLogger.Log("p"+currentParameterCounter + " : " + title);
                    cmd2.Parameters.AddWithValue("p"+currentParameterCounter++, title);
                }
                foreach(string yearsPrior in yearsExperience){
                    LambdaLogger.Log("p"+currentParameterCounter + " : " + yearsPrior);
                    cmd2.Parameters.AddWithValue("p"+currentParameterCounter++, float.Parse(yearsPrior));
                }

                foreach(string division in divisions){
                    LambdaLogger.Log("p"+currentParameterCounter + " : " + division);
                    cmd2.Parameters.AddWithValue("p"+currentParameterCounter++, division);
                }

                foreach(string companyname in companynames){
                    LambdaLogger.Log("p"+currentParameterCounter + " : " + companyname);
                    cmd2.Parameters.AddWithValue("p"+currentParameterCounter++, companyname);
                }

                foreach(string firstname in firstnames){
                    LambdaLogger.Log("p"+currentParameterCounter + " : " + firstname);
                    cmd2.Parameters.AddWithValue("p"+currentParameterCounter++, firstname);
                }

                foreach(string lastname in lastnames){
                    LambdaLogger.Log("p"+currentParameterCounter + " : " + lastname);
                    cmd2.Parameters.AddWithValue("p"+currentParameterCounter++, lastname);
                }

                foreach(string employementType in employementTypes){
                    LambdaLogger.Log("p"+currentParameterCounter + " : " + employementType);
                    cmd2.Parameters.AddWithValue("p"+currentParameterCounter++, employementType);
                }

                foreach(string officeLocation in officeLocations){
                    LambdaLogger.Log("p"+currentParameterCounter + " : " + officeLocation);
                    cmd2.Parameters.AddWithValue("p"+currentParameterCounter++, "%"+officeLocation+"%");
                }

                foreach(string offset in offsets){
                    LambdaLogger.Log("p"+currentParameterCounter + " : " + offset);
                    cmd2.Parameters.AddWithValue("p"+currentParameterCounter++, int.Parse(offset));
                }

                foreach(string fetch in fetchs){
                    LambdaLogger.Log("p"+currentParameterCounter + " : " + fetch);
                    cmd2.Parameters.AddWithValue("p"+currentParameterCounter++, int.Parse(fetch));
                }

                //TODO: is contractor, hiredate, termination date
                //Done: DIVISION, companyname, lastname, firstname. employment type and office location 

                //Run the sql command
                var reader2 = cmd2.ExecuteReader();
                int count = 0;
                while(reader2.Read()){
                    //Ya this is a dumb way cast please fix.
                    count = int.Parse(reader2[0].ToString());
                }

                reader2.Close();

                //LambdaLogger.Log("firstName ==: " + employees[0].firstName + "\n");
                //LambdaLogger.Log("employeeNumber ==: " + employees[0].employeeNumber + "\n");
                SearchResults searchResults = new SearchResults();
                searchResults.data = employees;
                searchResults.totalCount = count;

                //output = Newtonsoft.Json.JsonConvert.SerializeObject(employees); 
                output = Newtonsoft.Json.JsonConvert.SerializeObject(searchResults); 
                //jsonString = Newtonsoft.Json.JsonConvert.SerializeObject(obj);
                if(count == 0){
                    output = Newtonsoft.Json.JsonConvert.SerializeObject(null);
                }
            
                var response = new APIGatewayProxyResponse
                {
                    StatusCode = 200,
                    Body = output,
                    //Body = myDbItems.ToString(),
                    Headers = new Dictionary<string, string>
                    { 
                        { "Content-Type", "application/json" }, 
                        { "Access-Control-Allow-Origin", "*" },
                        { "Access-Control-Allow-Methods", "*" },
                        { "Access-Control-Allow-Headers", "*" },  
                    }
                };

                return response;
        }  catch(System.Exception){
                var response = new APIGatewayProxyResponse
                {
                    StatusCode = 400,
                    Body = "Invalid query Parameters",
                    Headers = new Dictionary<string, string>
                    { 
                        { "Content-Type", "application/json" },
                        { "Access-Control-Allow-Origin", "*" },
                        { "Access-Control-Allow-Methods", "*" },
                        { "Access-Control-Allow-Headers", "*" },
                    }
                };

                return response;
            }
        }


        public  APIGatewayProxyResponse getEmployeeID(APIGatewayProxyRequest request, ILambdaContext context)
        {
            try{
                var employeeID = HttpUtility.UrlDecode(request.QueryStringParameters["employeeNumber"]);  
                LambdaLogger.Log("ID: " + employeeID);

                using var con = new NpgsqlConnection(GetRDSConnectionString());
                con.Open();


                //Get the name of the bucket that holds the db scripts and the file that has the sql script we want.
                var bucketName = Environment.GetEnvironmentVariable("BUCKET_NAME");
                var objectKey = Environment.GetEnvironmentVariable("OBJECT_KEY");
                LambdaLogger.Log("bucketName: " + bucketName);
                LambdaLogger.Log("objectKey: " + objectKey);

                //Get the sql script from the bucket
                var script = getS3FileSync(bucketName, objectKey);
            
                
                //Read the sql from the file
                StreamReader readers3 = new StreamReader(script.ResponseStream);
                String sql = readers3.ReadToEnd();
                LambdaLogger.Log("sql: " + sql);
            

                using var cmd = new NpgsqlCommand(sql,con);
                cmd.Parameters.AddWithValue("p1", employeeID);

                //Run the sql command
                var reader = cmd.ExecuteReader();
        
                string output = string.Empty;
                //List<Employee> employees = new List<Employee>();
                Employee e = new Employee();

                while(reader.Read()) {
                    e.firstName = reader[0].ToString();
                    e.lastName = reader[1].ToString();
                    e.image = reader[2].ToString();
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
                    e.isContractor = System.Convert.ToBoolean(reader[14].ToString());
                    e.employeeNumber = reader[15].ToString();
                    e.employmentType = reader[16].ToString();
                    e.skills = reader[17].ToString();
                    e.officeLocation = reader[18].ToString();
                    //employees.Add(e);
                }

                reader.Close();
                LambdaLogger.Log("employeeNumber ==: " + e.employeeNumber + "\n");
                if(e.employeeNumber !=null){ 
                    output = Newtonsoft.Json.JsonConvert.SerializeObject(e);
                }else{
                    output = Newtonsoft.Json.JsonConvert.SerializeObject(null);
                }
                //jsonString = Newtonsoft.Json.JsonConvert.SerializeObject(obj);
            
                var response = new APIGatewayProxyResponse
                {
                    StatusCode = 200,
                    Body = output,
                    //Body = myDbItems.ToString(),
                    Headers = new Dictionary<string, string>
                    { 
                        { "Content-Type", "application/json" }, 
                        { "Access-Control-Allow-Origin", "*" },
                        { "Access-Control-Allow-Methods", "*" },
                        { "Access-Control-Allow-Headers", "*" },  
                    }
                };

                return response;
            }catch(System.Exception){
                    return new APIGatewayProxyResponse
                    {
                        StatusCode = 400,
                        Body = "Invalid querry parameters",
                        Headers = new Dictionary<string, string>
                        { 
                            { "Content-Type", "application/json" }, 
                            { "Access-Control-Allow-Origin", "*" },
                            { "Access-Control-Allow-Methods", "*" },
                            { "Access-Control-Allow-Headers", "*" },  
                        }
                    };
            }
        }
        
        private void insertSkills(string skills, string employeeNumber){
            //TODO fill in
            //Management:::Planning
            // SELECT sc."SkillCategoryId", s."SkillId" FROM "SkillCategory" sc, "Skill" s WHERE sc."SkillCategoryId" = s."SkillCategoryId" AND sc."Label" = :p0 AND s."Label" = :p1

            var bucketName = Environment.GetEnvironmentVariable("BUCKET_NAME");
            var objectKey = Environment.GetEnvironmentVariable("OBJECT_KEY");
            LambdaLogger.Log("bucketName: " + bucketName);
            LambdaLogger.Log("objectKey: " + objectKey);
            
            string[] skillList = skills.Split("|||");

            LambdaLogger.Log("skillsList: " + skillList[0].ToString());

            
            //----Run the SQL in code for the input----

            var idsScript = getS3FileSync(bucketName, "findSkillsIds.sql");
            
            var insertScript = getS3FileSync(bucketName, "insertContractorSkills.sql");

            //Read the get ids sql from the file
            StreamReader readers3ids = new StreamReader(idsScript.ResponseStream);
            string idsSQL = readers3ids.ReadToEnd();

            LambdaLogger.Log("idsSQL: " + idsSQL);

            //Read the insert sql from the file
            StreamReader readers3insert = new StreamReader(insertScript.ResponseStream);
            string insertSQL = readers3insert.ReadToEnd();

            LambdaLogger.Log("insertSQL: " + insertSQL);

            foreach (var skill in skillList ){
                
                using var con = new NpgsqlConnection(GetRDSConnectionString());
                con.Open();
                //Parse into the two strings
                string[] skillStrings= skill.Split(":::");
                string skillCategory = skillStrings[0];
                string skillLabel = skillStrings[1];

                LambdaLogger.Log("skill Category: " + skillCategory);
                LambdaLogger.Log("skill Label " + skillLabel);


                string categoryId ="";
                string skillId="";
                using var idsCmd = new NpgsqlCommand(idsSQL,con);

                LambdaLogger.Log("idsSQL " + idsSQL);

                //Add the bind variable
                idsCmd.Parameters.AddWithValue("p0",skillCategory);
                idsCmd.Parameters.AddWithValue("p1",skillLabel);
                
                LambdaLogger.Log("HELOO EXCECUTE ---------");
                using var readerID = idsCmd.ExecuteReader();

                LambdaLogger.Log("BYE EXCECUTE -----------");



                //LambdaLogger.Log("Reader closed? ---------" + readerID.IsClosed); 
                LambdaLogger.Log("Reader Rows ---------" + readerID.HasRows);
                //LambdaLogger.Log("Reader column count ---------" + readerID.FieldCount);

                while (readerID.Read()){
                    LambdaLogger.Log("HELOO WHILE ---------" );
                    categoryId = readerID[0].ToString();
                   
                    skillId = readerID[1].ToString();
                
                }
                LambdaLogger.Log("BYE WHILE ---------" );
        
                // readerID.Read();
                // LambdaLogger.Log("BYE READ -----");
                // if (readerID[0] == null){
                //     LambdaLogger.Log("NULL READER[0] -----");
                // }else{
                //     LambdaLogger.Log("NOT NULL READER[0] -----");
                //}
                // string categoryId = readerID[0].ToString();
                // string skillId = readerID[1].ToString();
                // LambdaLogger.Log("HELOO CLOSE -----");
                // LambdaLogger.Log("Reader next HI ? ---------"); 
                // readerID.NextResult();
                // readerID.Dispose();
                readerID.Close();
                LambdaLogger.Log("Reader next HI ? ---------"); 


                LambdaLogger.Log("categoryID " + categoryId);
                LambdaLogger.Log("skillId " + skillId);
                

                //Insert the skills into the EmployeeSkills table
                using var insertSkillCmd = new NpgsqlCommand(insertSQL,con);

                //Add the bind variable
                insertSkillCmd.Parameters.AddWithValue("p0",employeeNumber);
                insertSkillCmd.Parameters.AddWithValue("p1",categoryId);
                insertSkillCmd.Parameters.AddWithValue("p2",skillId);

                insertSkillCmd.ExecuteNonQuery();

                
                //call the sql to insert the pair into the employeeSkillsTable
                //skillFilter =  ;
                //}
                //es.skills LIKE '%Accounting:::Transaction Processing%' AND es.skills LIKE '%Accounting:::Reconciling%' 
                
                con.Dispose();
                con.Close();
            }
        }

        public APIGatewayProxyResponse getAllOfficeLocations(APIGatewayProxyRequest request, ILambdaContext context){

            try{

                List<string> companyName = new List<string>();
                if(request.MultiValueQueryStringParameters.ContainsKey("companyName")){
                    companyName = (List<string>)request.MultiValueQueryStringParameters["companyName"];
                    for(int i = 0; i < companyName.Count; i++){
                        companyName[i] = HttpUtility.UrlDecode(companyName[i]);
                    }
                }

                using var con = new NpgsqlConnection(GetRDSConnectionString());
                con.Open();


                //Get the name of the bucket that holds the db scripts and the file that has the sql script we want.
                var bucketName = Environment.GetEnvironmentVariable("BUCKET_NAME");
                var objectKey = Environment.GetEnvironmentVariable("OBJECT_KEY");
                LambdaLogger.Log("bucketName: " + bucketName);
                LambdaLogger.Log("objectKey: " + objectKey);

                //Get the sql script from the bucket
                var script = getS3FileSync(bucketName, objectKey);

                //Read the sql from the file
                StreamReader readers3 = new StreamReader(script.ResponseStream);
                String sql = readers3.ReadToEnd();

                LambdaLogger.Log("sql: " + sql);

                using var cmd = new NpgsqlCommand(sql,con);

                LambdaLogger.Log(companyName[0]);
                cmd.Parameters.AddWithValue("p0",companyName[0]);


                List<string> officeLocs = new List<string>();
                var reader = cmd.ExecuteReader();

                while (reader.Read()) {
                LambdaLogger.Log("Office Location: " + reader[0] + "\n");
                officeLocs.Add(reader[0].ToString());
                }

                string output = Newtonsoft.Json.JsonConvert.SerializeObject(officeLocs); 

                if(officeLocs.Count == 0){
                    output =  Newtonsoft.Json.JsonConvert.SerializeObject(null);
                }

                var response = new APIGatewayProxyResponse
                {
                    StatusCode = 200,
                    Body = output,
                    Headers = new Dictionary<string, string>
                    { 
                        { "Content-Type", "application/json" },
                        { "Access-Control-Allow-Origin", "*" },
                        { "Access-Control-Allow-Methods", "*" },
                        { "Access-Control-Allow-Headers", "*" },
                    }
                };

                return response;
            }
            catch(System.Exception){
                var response = new APIGatewayProxyResponse
                {
                    StatusCode = 400,
                    Body = "Invalid query Parameters",
                    Headers = new Dictionary<string, string>
                    { 
                        { "Content-Type", "application/json" },
                        { "Access-Control-Allow-Origin", "*" },
                        { "Access-Control-Allow-Methods", "*" },
                        { "Access-Control-Allow-Headers", "*" },
                    }
                };

                return response;
            }

            
        }

        public APIGatewayProxyResponse getAllGroupCodes(APIGatewayProxyRequest request, ILambdaContext context){

            try{
                List<string> companyName = new List<string>();
                if(request.MultiValueQueryStringParameters.ContainsKey("companyName")){
                    companyName = (List<string>)request.MultiValueQueryStringParameters["companyName"];
                    for(int i = 0; i < companyName.Count; i++){
                        companyName[i] = HttpUtility.UrlDecode(companyName[i]);
                    }
                }

                List<string> officeName = new List<string>();
                if(request.MultiValueQueryStringParameters.ContainsKey("officeName")){
                    officeName = (List<string>)request.MultiValueQueryStringParameters["officeName"];
                    for(int i = 0; i < officeName.Count; i++){
                        officeName[i] = HttpUtility.UrlDecode(officeName[i]);
                    }
                }

                using var con = new NpgsqlConnection(GetRDSConnectionString());
                con.Open();


                //Get the name of the bucket that holds the db scripts and the file that has the sql script we want.
                var bucketName = Environment.GetEnvironmentVariable("BUCKET_NAME");
                var objectKey = Environment.GetEnvironmentVariable("OBJECT_KEY");
                LambdaLogger.Log("bucketName: " + bucketName);
                LambdaLogger.Log("objectKey: " + objectKey);

                //Get the sql script from the bucket
                var script = getS3FileSync(bucketName, objectKey);

                //Read the sql from the file
                StreamReader readers3 = new StreamReader(script.ResponseStream);
                String sql = readers3.ReadToEnd();

                LambdaLogger.Log("sql: " + sql);

                using var cmd = new NpgsqlCommand(sql,con);

                LambdaLogger.Log(companyName[0]);
                cmd.Parameters.AddWithValue("p0",companyName[0]);
                
                LambdaLogger.Log(officeName[0]);
                cmd.Parameters.AddWithValue("p1",officeName[0]);

                List<string> groupLabels = new List<string>();
                
                var reader = cmd.ExecuteReader();
                while (reader.Read()) {
                LambdaLogger.Log("Group Label: " + reader[0] + "\n");
                groupLabels.Add(reader[0].ToString());
                }

                string output = Newtonsoft.Json.JsonConvert.SerializeObject(groupLabels); 
                if(groupLabels.Count == 0){
                    output =  Newtonsoft.Json.JsonConvert.SerializeObject(null);
                }

                var response = new APIGatewayProxyResponse
                {
                    StatusCode = 200,
                    Body = output,
                    Headers = new Dictionary<string, string>
                    { 
                        { "Content-Type", "application/json" },
                        { "Access-Control-Allow-Origin", "*" },
                        { "Access-Control-Allow-Methods", "*" },
                        { "Access-Control-Allow-Headers", "*" },
                    }
                };

                return response;
            }
            catch(System.Exception){
                var response = new APIGatewayProxyResponse
                {
                    StatusCode = 400,
                    Body = "Invalid query Parameters",
                    Headers = new Dictionary<string, string>
                    { 
                        { "Content-Type", "application/json" },
                        { "Access-Control-Allow-Origin", "*" },
                        { "Access-Control-Allow-Methods", "*" },
                        { "Access-Control-Allow-Headers", "*" }, 
                    }
                };

                return response;
            }

        }


        public  APIGatewayProxyResponse addContractor(APIGatewayProxyRequest request, ILambdaContext context){
            
            try{
                string requestBody = request.Body;
                Newtonsoft.Json.Linq.JObject body = Newtonsoft.Json.Linq.JObject.Parse(requestBody);
            

                //Create the connection to the database
                using var con = new NpgsqlConnection(GetRDSConnectionString());
                con.Open();


                //Get the name of the bucket that holds the db scripts and the file that has the sql script we want.
                var bucketName = Environment.GetEnvironmentVariable("BUCKET_NAME");
                var objectKey = Environment.GetEnvironmentVariable("OBJECT_KEY");
                LambdaLogger.Log("bucketName: " + bucketName);
                LambdaLogger.Log("objectKey: " + objectKey);

                
                //----Run the SQL to find the PhysicalLocation code of the input----
                
                var locationCodeScript = getS3FileSync(bucketName, "locationCode.sql");

                //Read the sql from the file
                StreamReader readers3LocationCode = new StreamReader(locationCodeScript.ResponseStream);
                string locationCodeSQL = readers3LocationCode.ReadToEnd();

                LambdaLogger.Log("locationCodeSQL: " + locationCodeSQL);

                using var locationCodeCmd = new NpgsqlCommand(locationCodeSQL,con);

                //Add the bind variable
                locationCodeCmd.Parameters.AddWithValue("p0",HttpUtility.UrlDecode(body["PhysicalLocation"].Value<string>()));
                LambdaLogger.Log("p0: " + HttpUtility.UrlDecode(body["PhysicalLocation"].Value<string>()));
                string physicalLocationId = "";
                try{
                    var LocationCodereader = locationCodeCmd.ExecuteReader();
                    
                    
                    LocationCodereader.Read();
                    physicalLocationId = LocationCodereader[0].ToString();
                    LocationCodereader.Close();
                }
                catch(System.Exception){
                    return new APIGatewayProxyResponse
                    {
                        StatusCode = 400,
                        Body = "Invalid physical location: " + HttpUtility.UrlDecode(body["PhysicalLocation"].Value<string>()),
                        Headers = new Dictionary<string, string>
                        { 
                            { "Content-Type", "application/json" }, 
                            { "Access-Control-Allow-Origin", "*" },
                            { "Access-Control-Allow-Methods", "*" },
                            { "Access-Control-Allow-Headers", "*" },  
                        }
                    };
                }


                //----Run the SQL to find the Company code of the input----
                var companyCodeScript = getS3FileSync(bucketName, "companyCode.sql");

                //Read the sql from the file
                StreamReader readers3CompanyCode = new StreamReader(companyCodeScript.ResponseStream);
                String comapanyCodeSQL = readers3CompanyCode.ReadToEnd();

                LambdaLogger.Log("comapanyCodeSQL: " + comapanyCodeSQL);

                using var companyCodeCmd = new NpgsqlCommand(comapanyCodeSQL,con);

                //Add the bind variable
                companyCodeCmd.Parameters.AddWithValue("p0",HttpUtility.UrlDecode(body["CompanyCode"].Value<string>()));

                LambdaLogger.Log("p0: " + HttpUtility.UrlDecode(body["CompanyCode"].Value<string>()));

                string companyCodeId ="";

                try{
                    var ComapanyCodereader = companyCodeCmd.ExecuteReader();
                    
                    ComapanyCodereader.Read();
                    companyCodeId = ComapanyCodereader[0].ToString();
                    ComapanyCodereader.Close();
                }
                catch(System.Exception){
                    return new APIGatewayProxyResponse
                    {
                        StatusCode = 400,
                        Body = "Invalid Company Code: " + HttpUtility.UrlDecode(body["CompanyCode"].Value<string>()),
                        Headers = new Dictionary<string, string>
                        { 
                            { "Content-Type", "application/json" }, 
                            { "Access-Control-Allow-Origin", "*" },
                            { "Access-Control-Allow-Methods", "*" },
                            { "Access-Control-Allow-Headers", "*" },  
                        }
                    };
                }

                

                //----Run the SQL to find the Office code of the input----
                var officeCodeScript = getS3FileSync(bucketName, "officeCode.sql");

                //Read the sql from the file
                StreamReader readers3OfficeCode = new StreamReader(officeCodeScript.ResponseStream);
                String officeCodeSQL = readers3OfficeCode.ReadToEnd();

                LambdaLogger.Log("officeCodeSQL: " + officeCodeSQL);

                using var officeCodeCmd = new NpgsqlCommand(officeCodeSQL,con);

                //Add the bind variable
                officeCodeCmd.Parameters.AddWithValue("p0",HttpUtility.UrlDecode(body["OfficeCode"].Value<string>()));
                officeCodeCmd.Parameters.AddWithValue("p1",companyCodeId);

                LambdaLogger.Log("p0: " + HttpUtility.UrlDecode(body["OfficeCode"].Value<string>()));
                LambdaLogger.Log("p1: " + companyCodeId);

                string officeCodeId = "";
                try{
                    var OfficeCodereader = officeCodeCmd.ExecuteReader();
                    
                    OfficeCodereader.Read();
                    officeCodeId = OfficeCodereader[0].ToString();
                    OfficeCodereader.Close();
                }
                catch(System.Exception){
                    return new APIGatewayProxyResponse
                    {
                        StatusCode = 400,
                        Body = "Invalid Office Code: " + HttpUtility.UrlDecode(body["OfficeCode"].Value<string>()),
                        Headers = new Dictionary<string, string>
                        { 
                            { "Content-Type", "application/json" }, 
                            { "Access-Control-Allow-Origin", "*" },
                            { "Access-Control-Allow-Methods", "*" },
                            { "Access-Control-Allow-Headers", "*" },  
                        }
                    };
                }
                
                

                //----Run the SQL to find the Group code of the input----
                var groupCodeScript = getS3FileSync(bucketName, "groupCode.sql");

                //Read the sql from the file
                StreamReader readers3GroupCode = new StreamReader(groupCodeScript.ResponseStream);
                String groupCodeSQL = readers3GroupCode.ReadToEnd();

                LambdaLogger.Log("groupCodeSQL: " + groupCodeSQL);

                using var groupCodeCmd = new NpgsqlCommand(groupCodeSQL,con);

                //Add the bind variable
                groupCodeCmd.Parameters.AddWithValue("p0",HttpUtility.UrlDecode(body["GroupCode"].Value<string>()));
                groupCodeCmd.Parameters.AddWithValue("p1",companyCodeId);
                groupCodeCmd.Parameters.AddWithValue("p2",officeCodeId);

                LambdaLogger.Log("p0: " + HttpUtility.UrlDecode(body["GroupCode"].Value<string>()));
                LambdaLogger.Log("p1: " + companyCodeId);
                LambdaLogger.Log("p2: " + officeCodeId);

                string groupCodeId = "";
                try{
                    var groupCodereader = groupCodeCmd.ExecuteReader();
                    
                    groupCodereader.Read();
                    groupCodeId = groupCodereader[0].ToString();
                    groupCodereader.Close();

                    LambdaLogger.Log("groupCodeId: " + officeCodeId);
                }
                catch(System.Exception){
                    return new APIGatewayProxyResponse
                    {
                        StatusCode = 400,
                        Body = "Invaild Group Code: " + HttpUtility.UrlDecode(body["GroupCode"].Value<string>()),
                        Headers = new Dictionary<string, string>
                        { 
                            { "Content-Type", "application/json" }, 
                            { "Access-Control-Allow-Origin", "*" },
                            { "Access-Control-Allow-Methods", "*" },
                            { "Access-Control-Allow-Headers", "*" },  
                        }
                    };
                }
                


                //Get the sql script from the bucket
                var script = getS3FileSync(bucketName, objectKey);
            
                
                //Read the sql from the file
                StreamReader readers3 = new StreamReader(script.ResponseStream);
                String sql = readers3.ReadToEnd();

                LambdaLogger.Log("sql: " + sql);

                using var cmd = new NpgsqlCommand(sql,con);

                //Add the bind variables
                
                cmd.Parameters.AddWithValue("p0",companyCodeId);
                cmd.Parameters.AddWithValue("p1",officeCodeId);
                cmd.Parameters.AddWithValue("p2",groupCodeId);
                cmd.Parameters.AddWithValue("p3",HttpUtility.UrlDecode(body["FirstName"].Value<string>()));
                cmd.Parameters.AddWithValue("p4",HttpUtility.UrlDecode(body["LastName"].Value<string>()));
                cmd.Parameters.AddWithValue("p5",HttpUtility.UrlDecode(body["EmploymentType"].Value<string>()));
                cmd.Parameters.AddWithValue("p6",HttpUtility.UrlDecode(body["Title"].Value<string>()));
                cmd.Parameters.AddWithValue("p7",HttpUtility.UrlDecode(body["HireDate"].Value<string>()));
                cmd.Parameters.AddWithValue("p8",((object)body["TerminationDate"].Value<string>() ?? DBNull.Value));
                cmd.Parameters.AddWithValue("p9",HttpUtility.UrlDecode(body["SupervisorEmployeeNumber"].Value<string>()));
                cmd.Parameters.AddWithValue("p10",HttpUtility.UrlDecode(body["YearsPriorExperience"].Value<string>()));
                cmd.Parameters.AddWithValue("p11",HttpUtility.UrlDecode(body["Email"].Value<string>()));
                cmd.Parameters.AddWithValue("p12",HttpUtility.UrlDecode(body["WorkPhone"].Value<string>()));
                cmd.Parameters.AddWithValue("p13",HttpUtility.UrlDecode(body["WorkCell"].Value<string>()));
                cmd.Parameters.AddWithValue("p14",physicalLocationId);
                cmd.Parameters.AddWithValue("p15",HttpUtility.UrlDecode(body["PhotoUrl"].Value<string>()));

                try{
                    var contractorReader = cmd.ExecuteReader();
                    contractorReader.Read();
                    string addedContractorEmployeeNumber = contractorReader[0].ToString();
                    LambdaLogger.Log("added contractor id: " + addedContractorEmployeeNumber);

                    contractorReader.Close();


                    //insert the contractors skills into the database
                    insertSkills(HttpUtility.UrlDecode(body["skills"].Value<string>()),addedContractorEmployeeNumber);

                    var response = new APIGatewayProxyResponse
                    {
                        StatusCode = 200,
                        Body = "New contractor added!",
                        Headers = new Dictionary<string, string>
                        { 
                            { "Content-Type", "application/json" }, 
                            { "Access-Control-Allow-Origin", "*" },
                            { "Access-Control-Allow-Methods", "*" },
                            { "Access-Control-Allow-Headers", "*" },  
                        }
                    };

                    return response;
                }
                catch(System.Exception){
                    return new APIGatewayProxyResponse
                    {
                        StatusCode = 400,
                        Body = "Invalid Skills "+ body["skills"].Value<string>(),
                        Headers = new Dictionary<string, string>
                        { 
                            { "Content-Type", "application/json" }, 
                            { "Access-Control-Allow-Origin", "*" },
                            { "Access-Control-Allow-Methods", "*" },
                            { "Access-Control-Allow-Headers", "*" },  
                        }
                    };
                }
            }catch(System.Exception){
                    return new APIGatewayProxyResponse
                    {
                        StatusCode = 400,
                        Body = "Invalid body",
                        Headers = new Dictionary<string, string>
                        { 
                            { "Content-Type", "application/json" }, 
                            { "Access-Control-Allow-Origin", "*" },
                            { "Access-Control-Allow-Methods", "*" },
                            { "Access-Control-Allow-Headers", "*" },  
                        }
                    };
            }
            
        }
    }
}
