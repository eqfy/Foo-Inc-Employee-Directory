import React from "react";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import makeStyles from "@material-ui/core/styles/makeStyles";
import clsx from "clsx";

export default function CustomCheckBox(props) {
    const { checked, handleChange } = props;
    const classes = useStyles();

    return (
        <FormControlLabel
            control={
                <Checkbox
                    disableRipple
                    checked={checked}
                    onChange={handleChange}
                    name={props.name}
                    color="default"
                    checkedIcon={
                        <span
                            className={clsx(classes.icon, classes.checkedIcon)}
                        />
                    }
                    icon={<span className={classes.icon} />}
                />
            }
            label={props.label}
        />
    );
}

const useStyles = makeStyles(() => ({
    icon: {
        borderRadius: 3,
        width: 20,
        height: 20,
        boxShadow:
            "inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)",
        backgroundColor: "#f5f8fa",
    },
    checkedIcon: {
        backgroundColor: "#1C83FB",
        "&:before": {
            display: "block",
            width: 20,
            height: 20,
            backgroundImage:
                "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" +
                " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " +
                "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23fff'/%3E%3C/svg%3E\")",
            content: '""',
        },
    },
}));
