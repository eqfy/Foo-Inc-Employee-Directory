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

            var sql = "SELECT NOW()";

            using var cmd = new NpgsqlCommand(sql, con);
            //using var cmd = new MySqlCommand(sql, con);
            LambdaLogger.Log("cmd created");

            var version = cmd.ExecuteScalar().ToString();
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
    }
}
