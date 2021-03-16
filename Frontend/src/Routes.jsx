import React from "react";
import { Route, Switch } from "react-router-dom";
import { Redirect } from "react-router";
import NotFound from "./components/NotFound";
import OrgChartPageContainer from "./components/OrgChartPageContainer";
import ProfilePageContainer from "./components/ProfilePageContainer";
import SearchPageContainer from "./components/SearchPageContainer";
import Header from "./components/Header";
import { PagePathEnum } from "components/common/constants";
import { NewContractorsContainer } from "components/NewContractorsContainer";

export default function Routes() {
    return (
        <Switch>
            <Route exact path={PagePathEnum.SEARCH}>
                <Header activeTabIndex={0} />
                <SearchPageContainer />
            </Route>
            <Route path={`${PagePathEnum.PROFILE}/:workerId`}>
                <Header activeTabIndex={1} />
                <ProfilePageContainer />
            </Route>
            <Route path={`${PagePathEnum.ORGCHART}/:workerId`}>
                <Header activeTabIndex={2} />
                <OrgChartPageContainer />
            </Route>
            <Route path={`${PagePathEnum.NEWCONTRACTOR}`}>
                <Header activeTabIndex={3} />
                <NewContractorsContainer />
            </Route>
            <Route path="/">
                <Header activeTabIndex={0} />
                <Redirect to={PagePathEnum.SEARCH} />
            </Route>
            <Route>
                <Header />
                <NotFound />
            </Route>
        </Switch>
    );
}
