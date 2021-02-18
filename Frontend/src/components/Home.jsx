import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { simpleAction } from "../actions/simpleAction";
import "./Home.css";

// FIXME We may not need this page
// It is currently used to demo the simple reducer/action
function Home(props) {
    const { resultOfSimpleAction } = props;

    const simpleAction = () => {
        props.simpleAction();
    };

    return (
        <div className="Home">
            <div className="lander">
                <h1>Main Dashboard</h1>
                <p className="text-muted">AE Dashboard</p>
                <pre>{JSON.stringify(resultOfSimpleAction)}</pre>
                <button onClick={simpleAction}>Test redux action</button>
            </div>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        resultOfSimpleAction: state.simpleReducer,
    };
};

const mapDispatchToProps = (dispatch) => ({
    simpleAction: () => dispatch(simpleAction()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home));
