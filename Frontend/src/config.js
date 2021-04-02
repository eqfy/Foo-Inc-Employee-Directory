import data from "./endpoint.json";
// If you are missing this file, try running deploy.sh.
// Specifically, the following command should generate the endpoint.json file
// ```
// cdk deploy ProjectStack --outputs-file Frontend/src/endpoint.json
// ```
// see more here https://319-project.atlassian.net/wiki/spaces/PD/pages/24379393/FrontEnd+API+Gateway+Communication

const config = {
    apiGateway: {
        REGION: "us-west-2",
        URL: data.ProjectStack.endpoint,
    },
    cognito: {
        REGION: "us-west-2",
        USER_POOL_ID: data.ProjectStack.UserPoolId,
        APP_CLIENT_ID: data.ProjectStack.UserPoolClientId,
        IDENTITY_POOL_ID: data.ProjectStack.IdentityPoolId
    },
    s3: {
        REGION: "us-west-2",
        BUCKET: data.ProjectStack.imageBucket
    }
};

export default config;
