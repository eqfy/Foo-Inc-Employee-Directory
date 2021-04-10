import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import OrgChartSearchLegendArea from "./OrgChartPage/OrgChartSearchLegendArea";
import OrgChartArea from "./OrgChartPage/OrgChartArea";
import { PageContainer } from "./common/PageContainer";

export function OrgChartPageContainer(props) {
    return (
        <PageContainer>
            <OrgChartSearchLegendArea />
            <OrgChartArea />
        </PageContainer>
    );
}

export default withRouter(connect()(OrgChartPageContainer));
