import { connect } from "react-redux";
import { withRouter } from "react-router";

export function OrgChartPageContainer(props) {
    return <h1>Org chart</h1>;
}

export default withRouter(connect()(OrgChartPageContainer));
