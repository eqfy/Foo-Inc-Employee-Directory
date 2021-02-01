using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using System.Data.SqlClient;

using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;

using Amazon.Lambda.Core;
using Amazon.Lambda.APIGatewayEvents;

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

            string dbname = "pdmkmwv8eglvin";

            if (string.IsNullOrEmpty(dbname)) return null;

            var rdsEndpoint = "pdmkmwv8eglvin.cxdaea64tjfp.us-west-2.rds.amazonaws.com";
            var username = "postgres";
            var password = "IoS1JC,az75nlje^ks^=4fsQJZG2Ts";
            string port = "5432";
            return "Data Source=" + rdsEndpoint + ";Initial Catalog=" + dbname + ";User ID=" + username + ";Password=" + password + ";";
        }

        public APIGatewayProxyResponse Get(APIGatewayProxyRequest request, ILambdaContext context)
        {
            LambdaLogger.Log("Start of GET");
            List<string> myDbItems = new List<string>();
            using (var Conn = new SqlConnection(GetRDSConnectionString()))
        	{
                LambdaLogger.Log("in first using");
            	using (var Cmd = new SqlCommand($"SELECT top 3 * from Employee", Conn))
            	{
                    LambdaLogger.Log("Start of second using");
                	// Open SQL Connection
                	Conn.Open();
                    LambdaLogger.Log("after conn open");
 
                	// Execute SQL Command
     	            SqlDataReader rdr = Cmd.ExecuteReader();
                    LambdaLogger.Log("after sqlDataReader");
 
                	// Loop through the results and add to list
                	while (rdr.Read())
                	{
                        myDbItems.Add(rdr[1].ToString());
                	}
            	}
        	}
            var response = new APIGatewayProxyResponse
            {
                StatusCode = 200,
                Body = myDbItems.ToString(),
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
