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
  API: {
    endpoints: [
      {
        name: "search",
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
