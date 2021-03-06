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

        public  APIGatewayProxyResponse GetByName(APIGatewayProxyRequest request, ILambdaContext context)
        {
            
            var firstName = request.QueryStringParameters["FirstName"];
            var lastName = request.QueryStringParameters["LastName"];  
            LambdaLogger.Log("FirstName: " + firstName);
            LambdaLogger.Log("FirstName: " + lastName);

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
            
            yearsPriorFilter = " ed.\"YearsPriorExperience\" > :p" + parameterCounter++;

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

        private string createIsContractorLocationsFilter(ref int parameterCounter){
            string isContractorFilter = " ed.\"isContractor\" = :p" + parameterCounter++ + " AND";
            return isContractorFilter;
        }




        
        public  APIGatewayProxyResponse search(APIGatewayProxyRequest request, ILambdaContext context)
        {
            
            // var firstName = request.QueryStringParameters["FirstName"];
            // var lastName = request.QueryStringParameters["LastName"];  
            // LambdaLogger.Log("FirstName: " + firstName);
            // LambdaLogger.Log("FirstName: " + lastName);
            int parameterCounter = 0;
            //Hopefully it will be able to turn everything into arrays

            // List<Employee> 
            List<string> skills = new List<string>();
            if(request.MultiValueQueryStringParameters.ContainsKey("Skills")){
                skills = (List<string>)request.MultiValueQueryStringParameters["Skills"];
            }
            List<string> locations = new List<string>();
            if (request.MultiValueQueryStringParameters.ContainsKey("LocationPhysical")){
                locations = (List<string>)request.MultiValueQueryStringParameters["LocationPhysical"];
            }
            List<string> titles = new List<string>();
            if(request.MultiValueQueryStringParameters.ContainsKey("Title")){
                titles = (List<string>)request.MultiValueQueryStringParameters["Title"];
            }
            
            //Note if they change the slide bar to allow for partial years change this to a float
            List<string> yearsExperience = new List<string>();
            if(request.MultiValueQueryStringParameters.ContainsKey("YearsPriorExperience")){
                yearsExperience = (List<string>)request.MultiValueQueryStringParameters["YearsPriorExperience"];
            }

            List<string> divisions = new List<string>();
            if(request.MultiValueQueryStringParameters.ContainsKey("division")){
                divisions = (List<string>)request.MultiValueQueryStringParameters["division"];
            }
            List<string> companynames = new List<string>();
            if(request.MultiValueQueryStringParameters.ContainsKey("companyname")){
                companynames = (List<string>)request.MultiValueQueryStringParameters["companyname"];
            }
            List<string> firstnames = new List<string>();
            if(request.MultiValueQueryStringParameters.ContainsKey("FirstName")){
                firstnames = (List<string>)request.MultiValueQueryStringParameters["FirstName"];
            }
            List<string> lastnames = new List<string>();
            if(request.MultiValueQueryStringParameters.ContainsKey("LastName")){
                lastnames = (List<string>)request.MultiValueQueryStringParameters["LastName"];
            }
            List<string> employementTypes = new List<string>();
            if(request.MultiValueQueryStringParameters.ContainsKey("EmploymentType")){
                employementTypes = (List<string>)request.MultiValueQueryStringParameters["EmploymentType"];
            }
            List<string> officeLocations = new List<string>();
            if(request.MultiValueQueryStringParameters.ContainsKey("officelocations")){
                officeLocations = (List<string>)request.MultiValueQueryStringParameters["officelocations"];
            }
            List<string> isContractor = new List<string>();
            if(request.MultiValueQueryStringParameters.ContainsKey("isContractor")){
                isContractor = (List<string>)request.MultiValueQueryStringParameters["isContractor"];
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
            
            string isContractorFilter ="";
            if(isContractor.Count > 0){
                isContractorFilter = createIsContractorLocationsFilter(ref parameterCounter);
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

            //TODO add all the different filter strings here
            if(skillFilter.Length > 0 || locationsFilter.Length > 0 || titlesFilter.Length > 0 || yearsPriorFilter.Length > 0 || divisionsFilter.Length >0 
            || companyNamesFilter.Length >0 || firstNamesFilter.Length >0 || lastNamesFilter.Length >0 || employmentTypesFilter.Length >0 || 
            officeLocationsFilter.Length>0 || isContractorFilter.Length>0){
                sql += " WHERE ";
            }

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
            sql += isContractorFilter;
            //TODO add the rest of the filters here

            //Remove the last 'AND' from the sql string
            sql = sql.Remove(sql.Length - 3);




            LambdaLogger.Log("sql: " + sql);
           

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
            //TODO Make it not case sensitive!
            foreach(string contractor in isContractor){
                bool isCon;
                if(contractor == "FALSE"){
                    isCon = false;
                }else{
                    isCon = true;
                }
                LambdaLogger.Log("p"+currentParameterCounter + " : " + isCon);
                cmd.Parameters.AddWithValue("p"+currentParameterCounter++, isCon);
            }
            
            //cmd.Parameters.AddWithValue("p1", firstName);
            //cmd.Parameters.AddWithValue("p2", lastName);

            //TODO: is contractor, hiredate, termination date

            //Done: DIVISION, companyname, lastname, firstname. employment type and office location 

            //Run the sql command
            var reader = cmd.ExecuteReader();
    
            string output = string.Empty;
            List<Employee> employees = new List<Employee>();
            //LambdaLogger.Log("Hey1"+ reader.Read().ToString());
            while(reader.Read()) {
                LambdaLogger.Log("Hey"+ reader[0].ToString());
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

        public  APIGatewayProxyResponse getEmployeeID(APIGatewayProxyRequest request, ILambdaContext context)
        {
            
            var employeeID = request.QueryStringParameters["EmployeeNumber"];  
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
            List<Employee> employees = new List<Employee>();

            while(reader.Read()) {
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
                employees.Add(e);
            }

            reader.Close();
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
    }
}
