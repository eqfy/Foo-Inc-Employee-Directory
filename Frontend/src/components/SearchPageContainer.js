import { connect } from "react-redux";
import { withRouter } from "react-router";
import SearchArea from "./searchPage/SearchArea";

export function SearchPageContainer(props) {
  return (
    <div>
      <h1>Search page</h1>
      <SearchArea></SearchArea>
    </div>
  );
}

export default withRouter(connect()(SearchPageContainer));
