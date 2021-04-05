import makeStyles from "@material-ui/core/styles/makeStyles";
import HelpIcon from "@material-ui/icons/Help";
import Menu from "@material-ui/core/Menu";
import React from "react";

const useStyles = makeStyles({
    helpButtonContainer: {
        width: 25,
        height: 25,
        marginTop: "auto",
        marginBottom: "auto",
    },
    help: {
        width: 25,
        height: 25,
        color: "#00569c",
        transition: "color 0.5s",
        "&:hover": {
            color: "#004680",
            cursor: "pointer",
        },
    },
    menu: {
        "& ol": {
            maxWidth: 600,
        },
        "& li": {
            margin: 5,
        },
    },
});

export function HelpButton(props) {
    const classes = useStyles();

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handlePopoverOpen = (e) => {
        setAnchorEl(e.currentTarget);
    };
    const handlePopoverClose = (e) => {
        setAnchorEl(null);
    };

    return (
        <div className={`${classes.helpButtonContainer} ${props.className}`}>
            <HelpIcon
                classes={{ root: classes.help }}
                onClick={handlePopoverOpen}
            />
            <Menu
                id="user-help-menu"
                anchorEl={anchorEl}
                getContentAnchorEl={null}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }}
                disableRestoreFocus
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handlePopoverClose}
                className={classes.menu}
            >
                {props.children}
            </Menu>
        </div>
    );
}
