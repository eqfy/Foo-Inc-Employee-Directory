import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

export default function Dropdown(props) {
    const classes = useStyles();
    const { values, currValue, handleChange } = props;

    const capitalize = (str) => {
        return str.toLowerCase().charAt(0).toUpperCase() + str.slice(1);
    };

    return (
        <div>
            <FormControl
                variant="outlined"
                className={classes.formControl}
                size="small"
            >
                <InputLabel id="select-label">
                    {capitalize(props.label)}
                </InputLabel>
                <Select
                    labelId="select-label"
                    onChange={handleChange}
                    label={capitalize(props.label)}
                    value={currValue}
                >
                    {values.map((value) => {
                        return (
                            <MenuItem value={value} key={value}>
                                {capitalize(value)}
                            </MenuItem>
                        );
                    })}
                </Select>
            </FormControl>
        </div>
    );
}

const useStyles = makeStyles(() => ({
    formControl: {
        minWidth: "150px",
        marginRight: "10px",
    },
}));
