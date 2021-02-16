import React from "react";
import { connect } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";

import "./App.css";
import Header from "./components/Header";
import Routes from "./Routes";

function App(props) {
    return (
        <div className="App">
            <Router>
                <Header />
                <div>{Routes()}</div>
            </Router>
        </div>
    );
}

const mapStateToProps = (state) => ({
    ...state,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(App);
