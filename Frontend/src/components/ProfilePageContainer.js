import { connect } from "react-redux";
import { withRouter } from "react-router";
import OrgChartIcon from './common/OrgChartIcon';

export function ProfilePageContainer(props) {
    return (
        <div className="page-container">
            <h1>Profile page</h1>
            <OrgChartIcon />
        </div>
    );
}

export default withRouter(connect()(ProfilePageContainer));
