import { API } from "aws-amplify";

export async function insertContractorAPI(payload) {
    const myInit = {
        queryStringParameters: payload,
    };
    return API.post("ae-api", "addContractor", myInit);
}
