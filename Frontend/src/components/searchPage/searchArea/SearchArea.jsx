import CircularProgress from "@material-ui/core/CircularProgress";
import Fade from "@material-ui/core/Fade";
import Grid from "@material-ui/core/Grid";
import styled from "@material-ui/core/styles/styled";
import makeStyles from "@material-ui/core/styles/makeStyles";
import React from "react";
import SearchByNameBar from "./SearchByNameBar";
import "./SearchArea.css";
import ExperienceSlider from "./ExperienceSlider";
import ApplyFilterWidget from "./ApplyFilterWidget";
import { connect } from "react-redux";
import { filterTypeEnum } from "states/filterState";

const useStyles = makeStyles({
    loading: {
        color: "#00569c",
    },
});

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

    const styles = useStyles();

    return (
        <div className="apply-filter full-height">
            <div className="heading">Filters</div>
            {loaded ? (
                <div className="filter-widgets">
                    <ExperienceSlider />
                    <ApplyFilterWidget
                        type={filterTypeEnum.LOCATION}
                        isCategorized={false}
                    />
                    <ApplyFilterWidget
                        type={filterTypeEnum.TITLE}
                        isCategorized={false}
                    />
                    <ApplyFilterWidget
                        type={filterTypeEnum.COMPANY}
                        isCategorized={false}
                    />
                    <ApplyFilterWidget
                        type={filterTypeEnum.DEPARTMENT}
                        isCategorized={false}
                    />
                    <ApplyFilterWidget
                        type={filterTypeEnum.SKILL}
                        isCategorized={true}
                    />
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
                        <CircularProgress
                            size={"50px"}
                            classes={{ root: styles.loading }}
                            data-cy="loading-filters"
                        />
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
