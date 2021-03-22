import { API } from "aws-amplify";
import mockPredictiveSearch from "../mocks/mockPredictiveSearch.json";

export async function getPredictiveSearchAPI(firstName, lastName) {
    const info = {
        queryStringParameters: { firstName: firstName, lastName: lastName },
    };
    return API.get("ae-api", "predictiveSearchResource", info);
}
