import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import OrgChart from "./OrgChartPage/OrgChart";

export function OrgChartPageContainer(props) {
    return <OrgChart />;
}

export default withRouter(connect()(OrgChartPageContainer));
