using System;
using System.IO;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

//using System.Data.SqlClient;

//using Microsoft.AspNet.Identity;
//using Microsoft.AspNet.Identity.EntityFramework;

using Amazon.Lambda.Core;
using Amazon.Lambda.APIGatewayEvents;

//using MySql.Data;
//using MySql.Data.MySqlClient;
using Npgsql;

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
            LambdaLogger.Log("fooooo");
            return input?.ToUpper();
        }

        public static string GetRDSConnectionString()
        {
            LambdaLogger.Log("GettingRDSString");
            //var appConfig = ConfigurationManager.AppSettings;

            string dbname = "postgres";
            //string dbname =  Environment.GetEnvironmentVariable("RDS_NAME");

            //if (string.IsNullOrEmpty(dbname)) return null;

            //var rdsEndpoint = "pdmkmwv8eglvin.cxdaea64tjfp.us-west-2.rds.amazonaws.com";
            var rdsEndpoint = Environment.GetEnvironmentVariable("RDS_ENDPOINT");
            //var username = "postgres";
            //var password = "IoS1JC,az75nlje^ks^=4fsQJZG2Ts";
            var password = Environment.GetEnvironmentVariable("RDS_PASSWORD");
            //string port = "5432";
            //return "Data Source=" + rdsEndpoint + ";Initial Catalog=" + dbname + ";User ID=" + username + ";Password=" + password + ";";
            return "Host=" + rdsEndpoint + ";Username=postgres;Password=" + password + ";Database=" + dbname;
            //return "server=" + rdsEndpoint +";user=postgres;database=project;port=3306;password=123456789";
        }

        public APIGatewayProxyResponse Get(APIGatewayProxyRequest request, ILambdaContext context)
        {
            LambdaLogger.Log("Start of GET");
            //List<string> myDbItems = new List<string>();
            LambdaLogger.Log(GetRDSConnectionString());
            //using (var Conn = new SqlConnection(GetRDSConnectionString()))
            /*using (var Conn = new NpgsqlConnection(GetRDSConnectionString()))
        	{
                LambdaLogger.Log("in first using");
            	//using (var Cmd = new SqlCommand($"SELECT top 3 * from Employee", Conn))
                using (var Cmd = new NpgsqlCommand($"SELECT top 3 * from Employee", Conn))
            	{
                    LambdaLogger.Log("Start of second using");
                	// Open SQL Connection
                	Conn.Open();
                    LambdaLogger.Log("after conn open");
 
                	// Execute SQL Command
     	            //SqlDataReader rdr = Cmd.ExecuteReader();
                    NpgsqlDataReader rdr = Cmd.ExecuteReader();
                    LambdaLogger.Log("after sqlDataReader");
 
                	// Loop through the results and add to list
                	while (rdr.Read())
                	{
                        myDbItems.Add(rdr[1].ToString());
                	}
            	}
        	}*/

            using var con = new NpgsqlConnection(GetRDSConnectionString());
            //using var con = new MySqlConnection(GetRDSConnectionString());
            LambdaLogger.Log("After con creation");
            con.Open();
            LambdaLogger.Log("After con open");

            var sql = "Select * FROM \"Employee\"";

            using var cmd = new NpgsqlCommand(sql, con);
            //using var cmd = new MySqlCommand(sql, con);
            LambdaLogger.Log("cmd created");

            //var version = cmd.ExecuteScalar().ToString();
            var version = cmd.ExecuteReader().ToString();
            LambdaLogger.Log("after cmd executed");
            LambdaLogger.Log(version);



            var response = new APIGatewayProxyResponse
            {
                StatusCode = 200,
                Body = version,
                //Body = myDbItems.ToString(),
                Headers = new Dictionary<string, string>
                { 
                    { "Content-Type", "application/json" }, 
                    { "Access-Control-Allow-Origin", "*" } 
                }
            };

            return response;
        }

        public APIGatewayProxyResponse Init(APIGatewayProxyRequest request, ILambdaContext context)
        {
            using var con = new NpgsqlConnection(GetRDSConnectionString());
            con.Open();

            var sql = "CREATE TABLE \"LocationCompany\" (" + 
            "\"CompanyCode\" varchar(2) PRIMARY KEY NOT NULL," +
            "\"Label\" varchar(20) NOT NULL," +
            "\"ManagerEmployeeNumber\" varchar(10) NOT NULL" +
        ");"+
        "CREATE TABLE \"LocationOffice\" (" +
            "\"CompanyCode\" varchar(2) NOT NULL,"+
            "\"OfficeCode\" varchar(2) NOT NULL,"+
            "\"Label\" varchar(20) NOT NULL,"+
            "\"ManagerEmployeeNumber\" varchar(10) NOT NULL,"+
            "PRIMARY KEY (\"CompanyCode\", \"OfficeCode\")"+
        ");"+
        "CREATE TABLE \"LocationGroup\" ("+
            "\"CompanyCode\" varchar(2) NOT NULL,"+
            "\"OfficeCode\" varchar(2) NOT NULL,"+
            "\"GroupCode\" varchar(2) NOT NULL,"+
            "\"Label\" varchar(20) NOT NULL,"+
            "\"ManagerEmployeeNumber\" varchar(10) NOT NULL,"+
            "PRIMARY KEY (\"CompanyCode\", \"OfficeCode\", \"GroupCode\")"+
        ");"+
        "CREATE TABLE \"LocationPhysical\" ("+
            "\"PhysicalLoacationId\" varchar(20) PRIMARY KEY NOT NULL,"+
            "\"Label\" varchar(100) NOT NULL,"+
            "\"SortValue\" varchar(100) NOT NULL"+
        ");"+
        "CREATE TABLE \"SkillCategory\" ("+
            "\"SkillCategoryId\" varchar(20) PRIMARY KEY NOT NULL,"+
            "\"Label\" varchar(100) NOT NULL,"+
            "\"SortValue\" varchar(10) NOT NULL"+
        ");"+
        "CREATE TABLE \"Skill\" ("+
            "\"SkillCategoryId\" varchar(32) NOT NULL,"+
            "\"SkillId\" varchar(32) NOT NULL,"+
            "\"Label\" varchar(100) NOT NULL,"+
            "\"SortValue\" varchar(10) NOT NULL,"+
            "PRIMARY KEY (\"SkillCategoryId\", \"SkillId\")"+
        ");"+
        "CREATE TABLE \"Employee\" ("+
            "\"EmployeeNumber\" varchar(10) PRIMARY KEY NOT NULL,"+
            "\"CompanyCode\" varchar(2) NOT NULL,"+
            "\"OfficeCode\" varchar(2) NOT NULL,"+
            "\"GroupCode\" varchar(2) NOT NULL,"+
            "\"LastName\" varchar(50),"+
            "\"FirstName\" varchar(25),"+
            "\"Title\" varchar(10),"+
            "\"HireDate\" date,"+
            "\"TerminateDate\" date,"+
            "\"SupervisorEmployeeNumber\" varchar(10) NOT NULL,"+
            "\"YearsPriorExperience\" numeric(3,1),"+
            "\"Email\" varchar(50),"+
            "\"WorkPhone\" varchar(24),"+
            "\"WorkCell\" varchar(24),"+
            "\"PhysicalLoacationId\" varchar(20) NOT NULL,"+
            "\"PhotoUrl\" varchar(255),"+
            "\"isContractor\" boolean NOT NULL DEFAULT false"+
        ");"+
        "CREATE TABLE \"EmployeeSkills\" ("+
            "\"EmployeeNumber\" varchar(10) NOT NULL,"+
            "\"SkillCategoryId\" varchar(32) NOT NULL,"+
            "\"SkillId\" varchar(32) NOT NULL,"+
            "PRIMARY KEY (\"EmployeeNumber\", \"SkillCategoryId\", \"SkillId\")"+
        ");"+
        "ALTER TABLE \"LocationOffice\" ADD FOREIGN KEY (\"ManagerEmployeeNumber\") REFERENCES \"Employee\" (\"EmployeeNumber\");"+
        "ALTER TABLE \"LocationOffice\" ADD FOREIGN KEY (\"CompanyCode\") REFERENCES \"LocationCompany\" (\"CompanyCode\");"+
        "ALTER TABLE \"Employee\" ADD FOREIGN KEY (\"PhysicalLoacationId\") REFERENCES \"LocationPhysical\" (\"PhysicalLoacationId\");"+
        "ALTER TABLE \"Employee\" ADD FOREIGN KEY (\"GroupCode\", \"OfficeCode\", \"CompanyCode\") REFERENCES \"LocationGroup\" (\"GroupCode\", \"OfficeCode\", \"CompanyCode\");"+
        "ALTER TABLE \"Employee\" ADD FOREIGN KEY (\"SupervisorEmployeeNumber\") REFERENCES \"Employee\" (\"EmployeeNumber\");"+
        "ALTER TABLE \"LocationCompany\" ADD FOREIGN KEY (\"ManagerEmployeeNumber\") REFERENCES \"Employee\" (\"EmployeeNumber\");"+
        "ALTER TABLE \"LocationGroup\" ADD FOREIGN KEY (\"ManagerEmployeeNumber\") REFERENCES \"Employee\" (\"EmployeeNumber\");"+
        "ALTER TABLE \"LocationGroup\" ADD FOREIGN KEY (\"OfficeCode\", \"CompanyCode\") REFERENCES \"LocationOffice\" (\"OfficeCode\", \"CompanyCode\");"+
        "ALTER TABLE \"Skill\" ADD FOREIGN KEY (\"SkillCategoryId\") REFERENCES \"SkillCategory\" (\"SkillCategoryId\");"+
        "ALTER TABLE \"EmployeeSkills\" ADD FOREIGN KEY (\"SkillId\", \"SkillCategoryId\") REFERENCES \"Skill\" (\"SkillId\", \"SkillCategoryId\");"+
        "ALTER TABLE \"EmployeeSkills\" ADD FOREIGN KEY (\"EmployeeNumber\") REFERENCES \"Employee\" (\"EmployeeNumber\");";

            using var cmd = new NpgsqlCommand(sql, con);
            LambdaLogger.Log("cmd created");

            var output = cmd.ExecuteNonQuery().ToString();

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
    }
}
