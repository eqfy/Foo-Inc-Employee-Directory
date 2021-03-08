import { Grid, styled } from "@material-ui/core";
import React from "react";
import SearchByNameBar from "./SearchByNameBar";
import "./SearchArea.css";
import ExperienceSlider from "./ExperienceSlider";
import ApplyFilterWidget from "./ApplyFilterWidget";

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
                <ApplyFilterArea />
            </StyledSearchAreaGridItem>
        </Grid>
    );
}

function ApplyFilterArea() {
    return (
        <div className="apply-filter">
            <div className="heading">Apply filters</div>
            <ExperienceSlider />
            <ApplyFilterWidget
                type="location"
                dataLabel="location"
                isCategorized={false}
            />
            <ApplyFilterWidget
                type="title"
                dataLabel="title"
                isCategorized={false}
            />
            <ApplyFilterWidget
                type="company"
                dataLabel="company"
                isCategorized={false}
            />
            <ApplyFilterWidget
                type="department"
                dataLabel="department"
                isCategorized={false}
            />
            <ApplyFilterWidget
                type="skill"
                dataLabel="skill"
                isCategorized={true}
            />
        </div>
    );
}

const StyledSearchAreaGridItem = styled(Grid)({
    width: "100%",
});

export default SearchArea;
