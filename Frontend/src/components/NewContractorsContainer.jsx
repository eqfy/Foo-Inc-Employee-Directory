import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { PageContainer } from "./common/PageContainer";
import AddContractor from "./AddContractor";

export function NewContractorsContainer(props) {
    return (
        <PageContainer>
            <AddContractor />
        </PageContainer>
    );
}

export default withRouter(connect()(NewContractorsContainer));
