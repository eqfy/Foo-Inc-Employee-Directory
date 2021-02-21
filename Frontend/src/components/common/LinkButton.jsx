import React from "react";
import { Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import styled from "styled-components";

function LinkButton(props) {
    return (
        <StyledButton
            disabled={!!props.disabled}
            // TODO: Find a nicer way to pass styles to this button
            // @ts-ignore
            styles={props.styles}
        >
            <StyledLink className="flex" to={props.to}>
                {props.children}
            </StyledLink>
        </StyledButton>
    );
}

export default LinkButton;

const StyledButton = styled(Button)`
    && {
        text-transform: none;
        ${(props) =>
            // @ts-ignore
            props.styles}
    }
`;

const StyledLink = styled(Link)`
    && {
        text-decoration: none;
        color: inherit;
        align-items: center;
    }
`;
