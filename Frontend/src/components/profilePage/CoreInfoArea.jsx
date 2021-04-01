import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import EmployeeCard from "../common/EmployeeCard";
import { Typography } from "@material-ui/core";
import "./ProfilePage.css";

function getInfoEntry(description, value) {
    return (
        <span key={description}>
            <b>{description}:</b> {`${value === "" ? "None" : value}`} <br />
        </span>
    );
}

function CoreInfoArea(props) {
    const { employee } = props;

    const information = [
        ["Cell", employee.workCell],
        ["Phone", employee.workPhone],
        ["Employment Type", employee.employmentType],
        ["Years Prior Experience", employee.yearsPriorExperience],
        ["Division", employee.division],
        ["Company Name", employee.companyName],
        ["Office Location", employee.officeLocation],
        ["Physical Location", employee.physicalLocation],
        ["Hire Date", employee.hireDate.split(" ")[0]],
    ];

    // const informationEntries = information.map((entry) => getInfoEntry(entry[0], entry[1]));

    return (
        <ContainerDiv>
            <CardContainer>
                <EmployeeCard employee={employee} linkToProfile={false} />
            </CardContainer>
            <div className="heading">Core Information</div>
            <StyledTypography
                variant="body1"
                color="textPrimary"
                // @ts-ignore
                component="p"
            >
                {information.map((entry) => getInfoEntry(entry[0], entry[1]))}
            </StyledTypography>
        </ContainerDiv>
    );
}

const ContainerDiv = styled.div`
    width: 30%;
    min-width: 300px;
    height: 100%;
    border-right: 1px solid black;
`;

const CardContainer = styled.div`
    display: flex;
    justify-content: center;
`;

const StyledTypography = styled(Typography)`
    && {
        font-size: 18px;
        margin-left: 18px;
    }
`;

export default connect()(CoreInfoArea);
