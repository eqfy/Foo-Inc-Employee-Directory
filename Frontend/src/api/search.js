import { API } from "aws-amplify";

export async function searchWorker(searchPayload) {
    const myInit = {
        queryStringParameters: searchPayload,
    };
    return API.get("ae-api", "search", myInit);
}

export async function searchWorkerByName(searchByNamePayload) {
    const myInit = {
        queryStringParameters: searchByNamePayload,
    };
    return API.get("ae-api", "predictiveSearchResource", myInit);
}
