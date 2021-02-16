import React from "react";
import { connect } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { simpleAction } from "./actions/simpleAction";

import "./App.css";
import Header from "./components/Header";
import Routes from "./Routes";

function App(props) {
    const simpleAction = () => {
        props.simpleAction();
    };

    return (
        <div className="App">
            <Router>
                <Header />
                <div>{Routes()}</div>
            </Router>
            <pre>{JSON.stringify(props)}</pre>
            <button onClick={simpleAction}>Test redux action</button>
        </div>
    );
}

const mapStateToProps = (state) => ({
    ...state,
});

const mapDispatchToProps = (dispatch) => ({
    simpleAction: () => dispatch(simpleAction()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
