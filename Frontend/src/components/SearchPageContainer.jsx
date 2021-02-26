import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { PageContainer } from "./common/PageContainer";
import ResultsArea from "./searchPage/ResultsArea";
import SearchArea from "./searchPage/searchArea/SearchArea";
import FilterArea from "./searchPage/FilterArea";
import { Grid, styled } from "@material-ui/core";
import { SEARCH_AREA_WIDTH } from "./common/constants";

export function SearchPageContainer(props) {
    React.useEffect(() => {
        // TODO get the current user's stored filters
    });

    return (
        // TODO: Refactor so this container div doesn't need to be added for every page container
        <PageContainer>
            <StyledSearchPageGridContainer
                container
                className=""
                spacing={1}
                wrap="nowrap"
            >
                <StyledSearchAreaGridItem item xs={2}>
                    <SearchArea />
                </StyledSearchAreaGridItem>
                <Grid item xs={10}>
                    <FilterArea />
                    <ResultsArea />
                </Grid>
            </StyledSearchPageGridContainer>
        </PageContainer>
    );
}

const mapStateToProps = (state) => {
    // TODO get the current filter info from the state
    return {};
};

const mapDispatchToProps = () => ({
    // TODO dispatches setFilters
});

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(SearchPageContainer)
);

const StyledSearchPageGridContainer = styled(Grid)({
    marginTop: 20,
});

const StyledSearchAreaGridItem = styled(Grid)({
    minWidth: SEARCH_AREA_WIDTH,
});
