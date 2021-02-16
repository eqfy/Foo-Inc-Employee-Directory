import React from "react";
import { connect } from "react-redux";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { simpleAction } from "./actions/simpleAction";
import "./App.css";
import { OrgChartPageContainer } from "./components/OrgChartPageContainer";
import { ProfilePageContainer } from "./components/ProfilePageContainer";
import { SearchPageContainer } from "./components/SearchPageContainer";
import { AppBar, Toolbar } from '@material-ui/core';
import styled from 'styled-components';

function App(props) {
  const simpleAction = (event) => {
    props.simpleAction();
  };

  return (
    <div className="App">
      <Router>
        <div>
          <AppBar position="static">
            <StyledToolbar>
              <StyledNavContainer>
                <StyledLink to="/">Search Home</StyledLink>
                <StyledLink to="/profile">Profile View</StyledLink>
                <StyledLink to="/orgchart">Org Chart</StyledLink>
              </StyledNavContainer>
            </StyledToolbar>
          </AppBar>

          {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
          <Switch>
            <Route exact path="/profile">
              <ProfilePageContainer />
            </Route>
            <Route exact path="/orgchart">
              <OrgChartPageContainer />
            </Route>
            <Route path="/">
              <SearchPageContainer />
            </Route>
          </Switch>
        </div>
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

const StyledNavContainer = styled.div`
  margin-left: auto;
`;

const StyledLink = styled(Link)`
  color: black;
  margin-left: 1rem;
`;

const StyledToolbar = styled(Toolbar)`
  background-color: #f4f4f4;
`;
