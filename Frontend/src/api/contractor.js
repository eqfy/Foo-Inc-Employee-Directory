import { API, Auth } from "aws-amplify";

export async function insertContractorAPI(payload) {
    const session = await Auth.currentSession();
    const token = session.getIdToken().getJwtToken();
    const myInit = {
        body: payload,
        headers: {
            Authorization: token,
        }
    };
    return API.put("ae-api", "addContractor", myInit);
}
