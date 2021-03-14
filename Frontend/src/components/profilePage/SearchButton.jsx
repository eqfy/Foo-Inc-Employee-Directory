import React from "react";
import LinkButton from "components/common/LinkButton";
import { ArrowBackIos as ArrowBack } from "@material-ui/icons";
import styled from "styled-components";
import { PagePathEnum } from 'components/common/constants';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
    root: {
        height: "30px",
        color: "#0663D0",
    }
});

function SearchButton() {
    const classes = useStyles();
    return (
        <LinkButton classes={classes} to={PagePathEnum.SEARCH}>
            <StyledArrow />
            Search
        </LinkButton>
    );
}

export default SearchButton;

const StyledArrow = styled(ArrowBack)`
    && {
        height: 18px;
    }
`;
