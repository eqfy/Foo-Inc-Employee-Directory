import React from "react";
import "./Home.css";
import { API } from "aws-amplify";

// FIXME We may not need this page
export default function Home() {
    var data = API.get("search", "employee")
        .then((response) => {
            console.log(response);
        })
        .catch((error) => {
            console.log(error);
        });
    console.log(data);

    return (
        <div className="Home">
            <div className="lander">
                <h1>Main Dashboard</h1>
                <p className="text-muted">AE Dashboard</p>
            </div>
        </div>
    );
}
