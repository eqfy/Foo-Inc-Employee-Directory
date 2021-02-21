import { Grid, Slider, Input, makeStyles } from "@material-ui/core";
import { Work } from "@material-ui/icons";
import React from "react";
import { connect } from "react-redux";

function ExperienceSlider(props) {
    const MAX_YEARS = 30;
    const [value, setValue] = React.useState(10);

    const handleSliderChange = (event, newValue) => {
        // TODO searchFilterAction()
        setValue(newValue);
    };

    const handleInputChange = (event) => {
        // TODO searchFilterAction()
        setValue(event.target.value === "" ? null : Number(event.target.value));
    };

    const handleBlur = () => {
        if (value < 0) {
            setValue(0);
        } else if (value > 40) {
            setValue(40);
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
                    max={MAX_YEARS}
                    style={{color: "#1c83fb"}}
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
                        max: MAX_YEARS,
                        type: "number",
                        "aria-labelledby": "input-slider",
                        style: {
                            textAlign: "center",
                        }
                    }}
                />
                Years
            </Grid>
        </Grid>
    );
}

const mapStateToProps = () => {
    // TODO get the year work experience filter info from the state
    return {};
};

const mapDispatchToProps = (dispatch) => ({
    // TODO dispatches searchFilterAction
});

export default connect(mapStateToProps, mapDispatchToProps)(ExperienceSlider);
