import { Grid, styled } from "@material-ui/core";
import React from "react";
import { connect } from "react-redux";
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
                <div className="heading">Apply filters</div>
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

export default connect()(SearchArea);
