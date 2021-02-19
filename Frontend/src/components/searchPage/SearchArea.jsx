import { Grid, styled } from "@material-ui/core";
import React from "react";
import { connect } from "react-redux";

import "../common/Common.css";
import ApplyFilterArea from "./ApplyFilterArea";
import SearchByNameBar from "./SearchByNameBar";

function SearchArea() {
    return (
        <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
            spacing={2}
        >
            <StyledSearchAreaGridItem item>
                <SearchByNameBar />
            </StyledSearchAreaGridItem>
            <StyledSearchAreaGridItem item>
                <h5>Apply filters</h5>
            </StyledSearchAreaGridItem>
            <StyledSearchAreaGridItem item>
                <ApplyFilterArea />
            </StyledSearchAreaGridItem>
        </Grid>
    );
}

const StyledSearchAreaGridItem = styled(Grid)({
    width: "100%",
    display: "flex",
});

export default connect()(SearchArea);
