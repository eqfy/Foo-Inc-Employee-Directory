import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { PageContainer } from "./common/PageContainer";
import ResultsArea from "./searchPage/ResultsArea";
import SearchArea from "./searchPage/SearchArea";
import FilterArea from "./searchPage/FilterArea";
import { Grid, styled } from "@material-ui/core";
import { SEARCH_AREA_WIDTH } from "./common/constants";

export function SearchPageContainer(props) {
    return (
        // TODO: Refactor so this container div doesn't need to be added for every page container
        <PageContainer>
            <h1>Search page</h1>
            <Grid container className="" spacing={1} wrap="nowrap">
                <StyledSearchAreaGridItem item xs={2}>
                    <SearchArea />
                </StyledSearchAreaGridItem>
                <Grid item xs={10}>
                    <FilterArea />
                    <ResultsArea />
                </Grid>
            </Grid>
        </PageContainer>
    );
}

export default withRouter(connect()(SearchPageContainer));

const StyledSearchAreaGridItem = styled(Grid)({
    minWidth: SEARCH_AREA_WIDTH,
});
