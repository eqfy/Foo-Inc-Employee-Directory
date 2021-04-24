import React from "react";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles(() => ({
    switch: {
        "& .MuiSwitch-thumb": {
            backgroundColor: "#1C83FB",
        },
        "& .MuiSwitch-track": {
            backgroundColor: "#4FA0FF",
        },
    },
}));

export default function CustomSwitch(props) {
    const { checked, handleChange, name, checkedLabel, uncheckedLabel } = props;
    const classes = useStyles();

    return (
        <FormControlLabel
            control={
                <Switch
                    checked={checked}
                    onChange={handleChange}
                    name={name}
                    color="primary"
                    classes={{ root: classes.switch }}
                />
            }
            label={checked ? checkedLabel : uncheckedLabel}
        />
    );
}
