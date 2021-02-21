import React from "react";
import { Route, Switch } from "react-router-dom";
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
            <Route exact path="/profile/:employeeId">
                <Header activeTabIndex={1} />
                <ProfilePageContainer />
            </Route>
            <Route exact path="/orgchart/:employeeId">
                <Header activeTabIndex={2} />
                <OrgChartPageContainer />
            </Route>
            {/* <Route exact path="/">
                <Header activeTabIndex={3} />
                <Home />
            </Route> */}
            <Route>
                <Header />
                <NotFound />
            </Route>
        </Switch>
    );
}
