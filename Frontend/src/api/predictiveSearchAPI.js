import { API } from "aws-amplify";

export async function getPredictiveSearchAPI(firstName, lastName) {
    const info = {
        queryStringParameters: { firstName: firstName, lastName: lastName },
    };
    return API.get("ae-api", "predictiveSearchResource", info);
}
