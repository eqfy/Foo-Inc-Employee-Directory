import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { PageContainer } from "./common/PageContainer";
import OrgChart from "./OrgChartPage/OrgChart";

export function OrgChartPageContainer(props) {
    return (
        <PageContainer>
            <OrgChart />
        </PageContainer>
    );
}

export default withRouter(connect()(OrgChartPageContainer));
