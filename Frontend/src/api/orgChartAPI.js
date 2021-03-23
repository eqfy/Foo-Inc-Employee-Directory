import { API } from "aws-amplify";

export async function getOrgChartAPI(workerId) {
    const info = {
        queryStringParameters: { WorkerID: workerId },
    };
    return API.get("ae-api", "orgChart", info);
}
