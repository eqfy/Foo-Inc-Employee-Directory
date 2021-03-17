import { API } from "aws-amplify";

export async function getProfileAPI(workerId) {
    const info = {
        queryStringParameters: { EmployeeNumber: workerId },
    };
    return API.get("ae-api", "getEmployeeIDResource", info);
}