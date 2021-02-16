import { connect } from "react-redux";
import { withRouter } from "react-router";

export function ProfilePageContainer(props) {
    return <h1>Profile page</h1>;
}

export default withRouter(connect()(ProfilePageContainer));
