import React from "react";
import { connect } from "react-redux";
import { useParams, withRouter } from "react-router";
import { PageContainer } from "./common/PageContainer";
import CoreInfoArea from "./profilePage/CoreInfoArea";
import data from "../mocks/mockEmployees.json";
import NotFound from "./NotFound";
import SkillsArea from "./profilePage/SkillsArea";
import PrevNextButtons from "./profilePage/PrevNextButtons";
import SearchButton from "./profilePage/SearchButton";
import styled from "styled-components";

export function ProfilePageContainer(props) {
    // @ts-ignore
    const { employeeId } = useParams();
    const index = data.findIndex(
        (employee) => employee.employeeId === employeeId
    );
    const employee = index !== -1 && data[index];

    if (!employee) {
        return <NotFound />;
    }

    return (
        <PageContainer>
            <StyledDiv className="flex space-between">
                <SearchButton />
                <PrevNextButtons index={index} employees={data} />
            </StyledDiv>
            <div className="flex">
                <CoreInfoArea employee={employee} />
                <SkillsArea employee={employee} />
            </div>
        </PageContainer>
    );
}

export default withRouter(connect()(ProfilePageContainer));

const StyledDiv = styled.div`
    margin-bottom: 25px;
`;
