import { loadFiltersAction } from "actions/filterAction";
import { Auth } from 'aws-amplify';
import { configureCurrUser, setAdmin, setSnackbarState } from "actions/generalAction";
import { searchWithAppliedFilterAction } from "actions/searchAction";
import React from "react";
import { connect } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";

import "./App.css";
import Routes from "./Routes";
import { Slide, Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

function Transition(props) {
    return <Slide {...props} direction="left" />;
  }

function App(props) {
    const {
        snackbarState,
        setSnackbarState,
        loadFiltersAction,
        configureCurrUser,
        setAdmin,
    } = props;

    const handleSnackbarClose = (_event, reason) => {
        if (reason !== 'clickaway') {
          setSnackbarState({
              open: false,
          });
        }
    }

    React.useEffect(() => {
        // Loads the initial filter data
        loadFiltersAction();

        // Load the current user and set the current user's physical location as a filter
        configureCurrUser();

        Auth.currentSession()
            .then(() => {
                setAdmin(true);
            })
            .catch((res) => {
                console.error(res);
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="App">
            <Router>
                <Routes />
            </Router>
            <Snackbar
                open={snackbarState.open}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                TransitionComponent={Transition}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    // @ts-ignore
                    severity={snackbarState.severity}
                >
                    {snackbarState.message}
                </Alert>
            </Snackbar>
        </div>
    );
}

const mapStateToProps = (state) => ({
    snackbarState: state.appState.snackbarState,
});

const mapDispatchToProps = (dispatch) => ({
    setAdmin: (isAdmin) => dispatch(setAdmin(isAdmin)),
    loadFiltersAction: () => dispatch(loadFiltersAction()),
    configureCurrUser: () => dispatch(configureCurrUser()),
    searchWithAppliedFilters: () => dispatch(searchWithAppliedFilterAction()),
    setSnackbarState: (snackbarState) => dispatch(setSnackbarState(snackbarState)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
