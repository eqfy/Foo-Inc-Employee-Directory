import styled from "styled-components";
import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { PageContainer } from "./common/PageContainer";
import ResultsArea from "./searchPage/ResultsArea";
import SearchArea from "./searchPage/SearchArea";

export function SearchPageContainer(props) {
    return (
        // TODO: Refactor so this container div doesn't need to be added for every page container
        <PageContainer>
            <h1>Search page</h1>
            <SearchArea />
            <ResultsDiv>
                <ResultsArea />
            </ResultsDiv>
        </PageContainer>
    );
}

export default withRouter(connect()(SearchPageContainer));

const ResultsDiv = styled.div`
    /* Placeholder margin */
    margin-left: 500px;
`;
