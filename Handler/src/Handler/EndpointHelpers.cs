using Amazon.Lambda.APIGatewayEvents;
using System.Collections.Generic;
using System.Web;
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

    public static string createSkillFilterAnd(List<string> skills, ref int parameterCounter){
        string skillFilter = "";
        
        for (int i = 0; i < skills.Count; i++ ){
                skillFilter += " es.\"skills\" LIKE :p"+parameterCounter +  " AND";
                parameterCounter++;
        }
        return skillFilter;
    }

    public static string createSkillFilterOr(List<string> skills, ref int parameterCounter){
        string skillFilter = " (";
        for(int i = 0; i < skills.Count; i++){
            skillFilter += "es.\"skills\" LIKE :p"+parameterCounter++;
            if(i < skills.Count - 1) {
                skillFilter += " OR ";
            }
        }

        skillFilter += ") AND";
        return skillFilter;
    }

    public static string createLocationsFilter(List<string> locations, ref int parameterCounter){
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

    public static string createTitlesFilter(List<string> titles, ref int parameterCounter){
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

    public static string createYearsPriorFilter(ref int parameterCounter){
        string yearsPriorFilter = "";
        
        yearsPriorFilter = " ed.\"YearsPriorExperience\" >= :p" + parameterCounter++;

        yearsPriorFilter += " AND";
        return yearsPriorFilter;
    }

    public static string createDivisionsFilter(List<string> divisions, ref int parameterCounter){
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

    public static string createCompanyNamesFilter(List<string> companynames, ref int parameterCounter){
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

    public static string createFirstNamesFilter(List<string> firstnames, ref int parameterCounter){
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

    public static string createLastNamesFilter(List<string> lastnames, ref int parameterCounter){
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

    public static string createEmploymentTypesFilter(List<string> employementTypes, ref int parameterCounter){
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

    public static string createOfficeLocationsFilter(List<string> officeLocations, ref int parameterCounter){
        string officeLocationsFilter = "";
        for(int i = 0; i < officeLocations.Count; i++){
            officeLocationsFilter += " ol.\"officelocations\" LIKE :p"+parameterCounter +  " AND";
            parameterCounter++;
        }
        return officeLocationsFilter;
    }

    public static string createShownWorkerTypeFilter(string shownWorkerType){
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

    public static string createOrderByFilter(string order, string orderDir){
        string orderDirFilter ="";
        if(orderDir == "ASC"){
            orderDirFilter = " ASC";
        } else if(orderDir == "DESC"){
            orderDirFilter = " DESC";
        } else{
            throw new System.Exception("Invalid orderDir");
        }
        string orderByFilter ="";
        if(order == "firstName"){
            orderByFilter = " ORDER BY \"FirstName\" " + orderDirFilter + ", \"EmployeeNumber\" " + orderDirFilter;
        } else if(order == "lastName"){
            orderByFilter = " ORDER BY \"LastName\" " + orderDirFilter + ", \"EmployeeNumber\" " + orderDirFilter;

        }else if(order == "title"){
            orderByFilter = " ORDER BY \"Title\" " + orderDirFilter + ", \"EmployeeNumber\" " + orderDirFilter;
        }
        //throw expection TODO
        return orderByFilter;
    }

    public static string createOffsetFilter(ref int parameterCounter){
        string offsetFilter = " OFFSET :p"+parameterCounter++;
        return offsetFilter;
    }

    public static string createFetchFilter(ref int parameterCounter){
        string fetchFilter = " FETCH NEXT :p"+parameterCounter++ + " ROWS ONLY";
        return fetchFilter;
    }

    public static List<string> getMultiValueQueryStringParameters(string key, APIGatewayProxyRequest request){
        List<string> returnValue = new List<string>();
        if(request.MultiValueQueryStringParameters.ContainsKey(key)){
            returnValue = (List<string>)request.MultiValueQueryStringParameters[key];
            for(int i = 0; i < returnValue.Count; i++){
                returnValue[i] = HttpUtility.UrlDecode(returnValue[i]);
            }
        }
        return returnValue;
    }

}