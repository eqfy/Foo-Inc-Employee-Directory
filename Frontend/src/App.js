import React from "react";
import { connect } from "react-redux";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { simpleAction } from "./actions/simpleAction";

import logo from "./logo.svg";
import "./App.css";
import { OrgChartPageContainer } from "./components/OrgChartPageContainer";
import { ProfilePageContainer } from "./components/ProfilePageContainer";
import { SearchPageContainer } from "./components/SearchPageContainer";

function App(props) {
  const simpleAction = (event) => {
    props.simpleAction();
  };

  return (
    <div className="App">
      <Router>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/">Search Home</Link>
              </li>
              <li>
                <Link to="/profile">Profile View</Link>
              </li>
              <li>
                <Link to="/orgchart">Org Chart</Link>
              </li>
            </ul>
          </nav>

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
      {/* {TODO delete the entire thing below} */}
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Hello! Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
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
