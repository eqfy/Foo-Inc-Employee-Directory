import { CircularProgress, Fade, Grid, styled } from "@material-ui/core";
import React from "react";
import SearchByNameBar from "./SearchByNameBar";
import "./SearchArea.css";
import ExperienceSlider from "./ExperienceSlider";
import ApplyFilterWidget from "./ApplyFilterWidget";
import { connect } from "react-redux";

function SearchArea(props) {
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
                <ApplyFilterArea loaded={props.loaded} />
            </StyledSearchAreaGridItem>
        </Grid>
    );
}

function ApplyFilterArea(props) {
    const { loaded } = props;

    return (
        <div className="apply-filter full-height">
            <div className="heading">Apply filters</div>
            {loaded ? (
                <div className="filter-widgets">
                    <ExperienceSlider />
                    <ApplyFilterWidget type="location" isCategorized={false} />
                    <ApplyFilterWidget type="title" isCategorized={false} />
                    <ApplyFilterWidget type="company" isCategorized={false} />
                    <ApplyFilterWidget
                        type="department"
                        isCategorized={false}
                    />
                    <ApplyFilterWidget type="skill" isCategorized={true} />
                </div>
            ) : (
                <div className="apply-filter-loading">
                    <Fade
                        in={!loaded}
                        style={{
                            transitionDelay: !loaded ? "800ms" : "0ms",
                        }}
                        unmountOnExit
                    >
                        <CircularProgress size={"50px"} />
                    </Fade>
                </div>
            )}
        </div>
    );
}

const mapStateToProps = (state) => {
    const { filters } = state;
    return {
        loaded: filters.loaded,
    };
};
export default connect(mapStateToProps)(SearchArea);

const StyledSearchAreaGridItem = styled(Grid)({
    width: "100%",
});
