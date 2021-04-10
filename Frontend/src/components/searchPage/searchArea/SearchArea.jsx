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
import { HelpButton } from "components/common/HelpButton";

const useStyles = makeStyles({
    loading: {
        color: "#00569c",
    },
    helpButton: {
        marginLeft: "auto",
        marginRight: 10,
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
            <div className="heading">
                Filters
                <HelpButton
                    searchHelpButton={true}
                    className={styles.helpButton}
                >
                    <li>
                        Filters will be applied according to the following
                        rules:
                    </li>
                    <ol>
                        <li>
                            Filters are grouped by type, all groups have an AND
                            relationship (e.g. if Location and Title type
                            filters are applied, the returned result must
                            satisfy the conditions in both filter type groups)
                        </li>
                        <li>
                            Skill type filters have an AND relationship (e.g. if
                            Planning (Accounting) and Planting (Agriculture) are
                            applied, the returned result must possess both
                            skills)
                        </li>
                        <li>
                            Non-skill type filters have an OR relationship (e.g.
                            if Vancouver and Victoria are both applied, then the
                            returned result can be located in either Vancouver
                            or Victoria)
                        </li>
                    </ol>
                </HelpButton>
            </div>
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
