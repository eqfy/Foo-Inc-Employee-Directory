import React, { useState } from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import { Redirect, useLocation } from "react-router";
import NotFound from "./components/NotFound";
import OrgChartPageContainer from "./components/OrgChartPageContainer";
import ProfilePageContainer from "./components/ProfilePageContainer";
import SearchPageContainer from "./components/SearchPageContainer";
import UpdatePageContainer from "./components/UpdatePageContainer";
import Header from "./components/Header";
import { PagePathEnum } from "components/common/constants";
import { NewContractorsContainer } from "components/NewContractorsContainer";
import Login from "components/AdminLogin";
import { PageTabIndexEnum } from "states/appState";

export default function Routes() {
    const history = useHistory();
    const location = useLocation();
    const [ready, setReady] = useState(false);

    // TODO: maybe find a better way to handle hash than this dirty workaround
    React.useEffect(() => {
        // /#!/abc/def => /abc/def
        if (location.hash && location.hash.length >= 2) {
            history.replace(location.hash.substring(2));
        }
        setReady(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return ready ? (
        <Switch>
            <Route exact path={PagePathEnum.SEARCH}>
                <Header activeTabIndex={PageTabIndexEnum.SEARCH} />
                <SearchPageContainer />
            </Route>
            <Route path={`${PagePathEnum.PROFILE}/:workerId`}>
                <Header activeTabIndex={PageTabIndexEnum.PROFILE} />
                <ProfilePageContainer />
            </Route>
            <Route path={`${PagePathEnum.ORGCHART}/:workerId`}>
                <Header activeTabIndex={PageTabIndexEnum.ORGCHART} />
                <OrgChartPageContainer />
            </Route>
            <Route path={`${PagePathEnum.NEWCONTRACTOR}`}>
                <Header activeTabIndex={PageTabIndexEnum.NEWCONTRACTOR} />
                <NewContractorsContainer />
            </Route>
            <Route
                path={`${PagePathEnum.LOGIN}`}
                render={(props) => (
                    <>
                        <Header activeTabIndex={PageTabIndexEnum.LOGIN} />
                        <Login {...props} />
                    </>
                )}
            ></Route>
            <Route path={`${PagePathEnum.UPDATE}`}>
                <Header activeTabIndex={PageTabIndexEnum.UPDATE} />
                <UpdatePageContainer />
            </Route>
            <Route path="/">
                <Header activeTabIndex={PageTabIndexEnum.SEARCH} />
                <Redirect to={PagePathEnum.SEARCH} />
            </Route>
            <Route>
                <Header />
                <NotFound />
            </Route>
        </Switch>
    ) : (
        <div></div>
    );
}
