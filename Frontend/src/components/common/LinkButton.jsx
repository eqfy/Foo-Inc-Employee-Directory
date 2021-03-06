import React from "react";

import Button from "@material-ui/core/Button";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Link } from "react-router-dom";
import styled from "styled-components";

const useStyles = makeStyles({
    label: {
        textTransform: 'none',
    },
});

function LinkButton(props) {
    const classes = useStyles();
    return (
        <Button
            disabled={!!props.disabled}
            classes={{ ...classes, ...props.classes }}
        >
            <StyledLink className="flex" to={props.to}>
                {props.children}
            </StyledLink>
        </Button>
    );
}

export default LinkButton;

const StyledLink = styled(Link)`
    && {
        text-decoration: none;
        color: inherit;
        align-items: center;
    }
`;
