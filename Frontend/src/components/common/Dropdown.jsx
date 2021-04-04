import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { convertCamelToSpaces } from "components/searchPage/helpers";

export default function Dropdown(props) {
    const classes = useStyles();
    const { values, currValue, handleChange } = props;

    return (
        <FormControl
            variant="outlined"
            className={classes.formControl}
            size="small"
        >
            <InputLabel id="select-label">{props.label}</InputLabel>
            <Select
                labelId="select-label"
                onChange={handleChange}
                label={convertCamelToSpaces(props.label)}
                value={currValue}
            >
                {values.map((value, index) => {
                    return (
                        <MenuItem value={value} key={value + index}>
                            {convertCamelToSpaces(value)}
                        </MenuItem>
                    );
                })}
            </Select>
        </FormControl>
    );
}

const useStyles = makeStyles(() => ({
    formControl: {
        minWidth: "150px",
        marginRight: "10px",
    },
}));
