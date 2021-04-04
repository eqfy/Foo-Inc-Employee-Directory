import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Amplify } from "aws-amplify";
import config from "./config";
import configureStore from "./store";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

Amplify.configure({
    Auth: {
        region: config.cognito.REGION,
        userPoolId: config.cognito.USER_POOL_ID,
        identityPoolId: config.cognito.IDENTITY_POOL_ID,
        userPoolWebClientId: config.cognito.APP_CLIENT_ID,
    },
    Storage: {
        AWSS3: {
            region: config.s3.REGION,
            bucket: config.s3.BUCKET,
        },
    },
    API: {
        endpoints: [
            {
                name: "ae-api",
                endpoint: config.apiGateway.URL,
                region: config.apiGateway.REGION,
            },
        ],
    },
});

ReactDOM.render(
    <React.StrictMode>
        <Provider store={configureStore()}>
            <App />
        </Provider>
    </React.StrictMode>,
    document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
