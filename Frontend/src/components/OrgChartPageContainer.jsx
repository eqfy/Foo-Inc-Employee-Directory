import { connect } from "react-redux";
import { withRouter } from "react-router";
import { PageContainer } from './common/PageContainer';

export function OrgChartPageContainer(props) {
    return (
        <PageContainer>
            <h1>Org chart</h1>
        </PageContainer>
    );
}

export default withRouter(connect()(OrgChartPageContainer));
