import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { PageContainer } from "./common/PageContainer";
import ResultsArea from "./searchPage/ResultsArea";
import SearchArea from "./searchPage/searchArea/SearchArea";
import FilterArea from "./searchPage/FilterArea";
import { Grid, styled, makeStyles } from "@material-ui/core";
import { SEARCH_AREA_WIDTH } from "./common/constants";

const useStyles = makeStyles((theme) => ({
    gridContainer: {
        marginTop: 20,
        [theme.breakpoints.up("sm")]: {
            flexWrap: "nowrap",
        },
        [theme.breakpoints.only("xs")]: {
            flexWrap: "wrap",
        },
    },
}));

export const SearchWithFilterTimer = {};

export function SearchPageContainer(props) {
    const styles = useStyles();

    return (
        // TODO: Refactor so this container div doesn't need to be added for every page container
        <PageContainer>
            <Grid
                container
                classes={{ root: styles.gridContainer }}
                spacing={1}
            >
                <StyledSearchAreaGridItem item sm={2} xs={12}>
                    <SearchArea />
                </StyledSearchAreaGridItem>
                <Grid item sm={10} xs={12}>
                    <FilterArea />
                    <ResultsArea />
                </Grid>
            </Grid>
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

const StyledSearchAreaGridItem = styled(Grid)({
    minWidth: SEARCH_AREA_WIDTH,
});
