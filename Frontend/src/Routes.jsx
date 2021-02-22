import React from "react";
import { Route, Switch } from "react-router-dom";
import { Redirect } from "react-router";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import OrgChartPageContainer from "./components/OrgChartPageContainer";
import ProfilePageContainer from "./components/ProfilePageContainer";
import SearchPageContainer from "./components/SearchPageContainer";
import Header from "./components/Header";

export default function Routes() {
    return (
        <Switch>
            <Route exact path="/search">
                <Header activeTabIndex={0} />
                <SearchPageContainer />
            </Route>
            <Route path="/profile/:employeeId">
                <Header activeTabIndex={1} />
                <ProfilePageContainer />
            </Route>
            <Route path="/orgchart/:employeeId">
                <Header activeTabIndex={2} />
                <OrgChartPageContainer />
            </Route>
            <Route path="/">
                <Header activeTabIndex={0} />
                <Redirect to="/search" />
            </Route>
            <Route>
                <Header />
                <NotFound />
            </Route>
        </Switch>
    );
}
