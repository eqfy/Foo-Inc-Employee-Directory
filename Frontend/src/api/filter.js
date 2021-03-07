import { API } from "aws-amplify";
export async function getFilterAPI() {
    const myInit = {
        queryStringParameters: {LocationPhysical: 'Vancouver',},
    };
    return API.get("search", "search", myInit);
}