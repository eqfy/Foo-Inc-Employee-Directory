import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { PageContainer } from "./common/PageContainer";

export function ProfilePageContainer(props) {
    return (
        <PageContainer>
            <h1>Profile page</h1>
        </PageContainer>
    );
}

export default withRouter(connect()(ProfilePageContainer));
