import { connect } from "react-redux";
import { withRouter } from "react-router";
import { PageContainer } from "./common/PageContainer";
import SearchArea from "./searchPage/SearchArea";

export function SearchPageContainer(props) {
    return (
        // TODO: Refactor so this container div doesn't need to be added for every page container
        <PageContainer>
            <h1>Search page</h1>
            <SearchArea />
        </PageContainer>
    );
}

export default withRouter(connect()(SearchPageContainer));
