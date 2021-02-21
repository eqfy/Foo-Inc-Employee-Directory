import React from "react";
import LinkButton from "components/common/LinkButton";
import { ArrowBackIos as ArrowBack } from "@material-ui/icons";
import styled from "styled-components";

function SearchButton() {
    return (
        <LinkButton styles="height: 30px; color: #0663D0" to="/search">
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
