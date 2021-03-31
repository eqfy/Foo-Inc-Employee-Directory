import React from "react";
import LinkButton from "components/common/LinkButton";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
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

const StyledArrow = styled(ArrowBackIosIcon)`
    && {
        height: 18px;
    }
`;
