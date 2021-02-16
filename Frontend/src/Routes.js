import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import OrgChartPageContainer from "./components/OrgChartPageContainer";
import ProfilePageContainer from "./components/ProfilePageContainer";
import SearchPageContainer from "./components/SearchPageContainer";

export default function Routes() {
  return (
    <Switch>
      <Route exact path="/profile">
        <ProfilePageContainer />
      </Route>
      <Route exact path="/orgchart">
        <OrgChartPageContainer />
      </Route>
      <Route exact path="/search">
        <SearchPageContainer />
      </Route>
      <Route exact path="/">
        <Home />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}
