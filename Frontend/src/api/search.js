import { API } from "aws-amplify";

export async function searchWorker(searchPayload) {
    // TODO we need to turn searchProps into query parameters

    return {};
    // return API.get("search", "employee");
}

export async function searchWorkerByName(searchByNamePayload) {
    const myInit = {
        queryStringParameters: searchByNamePayload,
    };
    return API.get("ae-api", "search", myInit);
}
