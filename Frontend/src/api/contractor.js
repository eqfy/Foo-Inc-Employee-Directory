import { API } from "aws-amplify";

export async function insertContractorAPI(payload) {
    const myInit = {
        body: payload,
    };
    return API.put("ae-api", "addContractor", myInit);
}
