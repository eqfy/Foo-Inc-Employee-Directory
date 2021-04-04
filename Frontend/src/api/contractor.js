import { API, Auth } from "aws-amplify";

export async function insertContractorAPI(payload) {
    const session = await Auth.currentSession();
    const token = session.getIdToken().getJwtToken();
    const myInit = {
        body: payload,
        headers: {
            Authorization: token,
        },
    };
    return API.put("ae-api", "addContractor", myInit);
}

export async function getOfficeLocations(companyName) {
    const myInit = {
        queryStringParameters: { companyName },
    };
    return API.get("ae-api", "getAllOfficeLocations", myInit);
}

export async function getGroups(payload) {
    const myInit = {
        queryStringParameters: payload,
    };
    return API.get("ae-api", "getAllGroupCodes", myInit);
}
