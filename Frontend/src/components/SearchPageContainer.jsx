import React from "react";
import { withRouter } from "react-router";
import { PageContainer } from "./common/PageContainer";
import ResultsArea from "./searchPage/ResultsArea";
import SearchArea from "./searchPage/searchArea/SearchArea";
import FilterArea from "./searchPage/FilterArea";
import { Grid, makeStyles } from "@material-ui/core";

export const SearchWithFilterTimer = {};

export function SearchPageContainer(props) {
    const classes = useStyles();
    return (
        // TODO: Refactor so this container div doesn't need to be added for every page container
        <PageContainer>
            <Grid
                container
                className=""
                spacing={1}
                wrap="nowrap"
                classes={{ root: classes.gridContainer }}
            >
                <Grid item xs={2} classes={{ root: classes.searchAreaItem }}>
                    <SearchArea />
                </Grid>
                <Grid
                    item
                    xs={10}
                    classes={{ root: classes.filterAndResultAreaItem }}
                >
                    <FilterArea />
                    <ResultsArea />
                </Grid>
            </Grid>
        </PageContainer>
    );
}

export default withRouter(SearchPageContainer);

const useStyles = makeStyles({
    gridContainer: {
        marginTop: 20,
    },
    searchAreaItem: {
        minWidth: 250,
    },
    filterAndResultAreaItem: {
        minWidth: 900,
    },
});