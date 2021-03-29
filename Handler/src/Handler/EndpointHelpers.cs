using Amazon.Lambda.APIGatewayEvents;
using System.Collections.Generic;
public static class EH{
    public static APIGatewayProxyResponse response(int statusCode, string body){

        return new APIGatewayProxyResponse
                    {
                        StatusCode = statusCode,
                        Body = body,
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