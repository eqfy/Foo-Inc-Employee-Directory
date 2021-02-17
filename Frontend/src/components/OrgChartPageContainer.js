import { connect } from "react-redux";
import { withRouter } from "react-router";

export function OrgChartPageContainer(props) {
    return (
        <div className="page-container">
            <h1>Org chart</h1>
        </div>
    );
}

export default withRouter(connect()(OrgChartPageContainer));
