import { Grid, Slider, Input } from "@material-ui/core";
import { Work } from "@material-ui/icons";
import { searchByExperienceAction } from "actions/searchAction";
import { MAX_WORK_EXPERIENCE } from "components/common/constants";
import { SearchWithFilterTimer } from "components/SearchPageContainer";
import React from "react";
import { connect } from "react-redux";
import { coordinatedDebounce } from "../helpers";

function ExperienceSlider(props) {
    const { searchByExperienceAction, yearsPriorExperience } = props;
    const [value, setValue] = React.useState(yearsPriorExperience);

    const handleSliderChange = (_event, newValue) => {
        setValue(newValue);
        coordinatedDebounce(
            searchByExperienceAction,
            SearchWithFilterTimer
        )(newValue);
    };

    const handleInputChange = (event) => {
        const targetValue = event.target.value;
        setValue(targetValue);
        coordinatedDebounce(
            searchByExperienceAction,
            SearchWithFilterTimer
        )(targetValue);
    };

    const handleBlur = () => {
        if (value < 0) {
            setValue(0);
            coordinatedDebounce(
                searchByExperienceAction,
                SearchWithFilterTimer
            )(0);
        } else if (value > MAX_WORK_EXPERIENCE) {
            setValue(MAX_WORK_EXPERIENCE);
            coordinatedDebounce(
                searchByExperienceAction,
                SearchWithFilterTimer
            )(MAX_WORK_EXPERIENCE);
        }
    };

    return (
        <Grid
            container
            spacing={2}
            alignItems="center"
            className="experience-slider"
        >
            <Grid item>
                <Work />
            </Grid>
            <Grid item xs>
                <Slider
                    value={typeof value === "number" ? value : 0}
                    onChange={handleSliderChange}
                    aria-labelledby="input-slider"
                    max={MAX_WORK_EXPERIENCE}
                    style={{ color: "#1c83fb" }}
                />
            </Grid>
            <Grid item>
                {"> "}
                <Input
                    value={value}
                    margin="dense"
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    inputProps={{
                        step: 1,
                        min: 0,
                        max: MAX_WORK_EXPERIENCE,
                        type: "number",
                        "aria-labelledby": "input-slider",
                        style: {
                            textAlign: "center",
                        },
                    }}
                />
                Years
            </Grid>
        </Grid>
    );
}

const mapStateToProps = (state) => {
    const {
        appState: { yearsPriorExperience = 0 },
    } = state;
    return {
        yearsPriorExperience,
    };
};

const mapDispatchToProps = (dispatch) => ({
    searchByExperienceAction: (value) =>
        dispatch(searchByExperienceAction(value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ExperienceSlider);
