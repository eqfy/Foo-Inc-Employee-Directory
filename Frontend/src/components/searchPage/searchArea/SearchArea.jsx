import { Grid, styled, Typography } from "@material-ui/core";
import React from "react";
import ApplyFilterArea from "./ApplyFilterArea";
import SearchByNameBar from "./SearchByNameBar";
import "./SearchArea.css";

function SearchArea() {
    return (
        <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
            spacing={2}
            className="search-area"
        >
            <StyledSearchAreaGridItem item>
                <SearchByNameBar />
            </StyledSearchAreaGridItem>
            <StyledSearchAreaGridItem item>
                <Typography className="heading">Apply filters</Typography>
            </StyledSearchAreaGridItem>
            <StyledSearchAreaGridItem item>
                <ApplyFilterArea />
            </StyledSearchAreaGridItem>
        </Grid>
    );
}

const StyledSearchAreaGridItem = styled(Grid)({
    width: "100%",
});

export default SearchArea;
