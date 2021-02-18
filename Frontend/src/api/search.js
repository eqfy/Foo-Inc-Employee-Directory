import { API } from "aws-amplify";

export async function searchAPI(searchProps) {
    // TODO we need to turn searchProps into query parameters
    return API.get("search", "employee");
}
