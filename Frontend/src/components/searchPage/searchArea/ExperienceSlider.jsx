import Grid from "@material-ui/core/Grid";
import Slider from "@material-ui/core/Slider";
import Input from "@material-ui/core/Input";
import WorkIcon from "@material-ui/icons/Work";
import { searchByExperienceAction } from "actions/searchAction";
import { MAX_WORK_EXPERIENCE } from "components/common/constants";
import { SearchWithFilterTimer } from "components/SearchPageContainer";
import React from "react";
import { connect } from "react-redux";
import { coordinatedDebounce } from "../../common/helpers";

function ExperienceSlider(props) {
    const { yearsPriorExperience, searchByExperienceAction } = props;
    const [value, setValue] = React.useState(yearsPriorExperience);

    const setAndDispatchValue = (targetValue) => {
        if (isNaN(targetValue)) {
            return;
        }
        let newValue = targetValue;
        if (targetValue < 0) {
            newValue = 0;
        } else if (targetValue > MAX_WORK_EXPERIENCE) {
            newValue = MAX_WORK_EXPERIENCE;
        }
        setValue(newValue);
        coordinatedDebounce(
            searchByExperienceAction,
            SearchWithFilterTimer
        )(newValue);
    };

    const handleSliderChange = (_event, newValue) => {
        setAndDispatchValue(newValue);
    };

    const handleInputChange = (event) => {
        const targetValue = event.target.value;
        setValue(isNaN(targetValue) ? targetValue : parseInt(targetValue));
    };

    const handleBlur = () => {
        setAndDispatchValue(value);
    };

    return (
        <Grid
            container
            spacing={2}
            alignItems="center"
            className="experience-slider"
        >
            <Grid item>
                <WorkIcon style={{ color: "rgba(0, 0, 0, 0.88)" }} />
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
                {"≥ "}
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
