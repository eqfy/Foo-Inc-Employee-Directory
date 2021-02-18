import { connect } from "react-redux";
import ResultsArea from './ResultsArea';
import styled from "styled-components";
import "../common/Common.css"

function SearchArea(props) {
    return (
        <ResultsDiv>
            <ResultsArea />
        </ResultsDiv>
    );
}

const ResultsDiv = styled.div`
    /* Placeholder margin */
    margin-left: 500px;
`;

export default connect()(SearchArea);
