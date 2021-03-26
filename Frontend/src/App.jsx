import { loadFiltersAction } from "actions/filterAction";
import React from "react";
import { connect } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";

import "./App.css";
import Routes from "./Routes";

function App(props) {
    React.useEffect(() => {
        // Loads the initial filter data
        props.loadFiltersAction();
    }, [props]); // TODO Make sure that this only runs once
    return (
        <div className="App">
            <Router>
                <Routes />
            </Router>
        </div>
    );
}

const mapDispatchToProps = (dispatch) => ({
    loadFiltersAction: () => dispatch(loadFiltersAction()),
});

export default connect(null, mapDispatchToProps)(App);
