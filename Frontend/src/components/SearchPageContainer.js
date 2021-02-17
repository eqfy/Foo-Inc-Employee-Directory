import { connect } from "react-redux";
import { withRouter } from "react-router";
import SearchArea from "./searchPage/SearchArea";

export function SearchPageContainer(props) {
    return (
        // TODO: Refactor so this div doesn't need to be added for every page container
        <div className="page-container">
            <h1>Search page</h1>
            <SearchArea />
        </div>
    );
}

export default withRouter(connect()(SearchPageContainer));
