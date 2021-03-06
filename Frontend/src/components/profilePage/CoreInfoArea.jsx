import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import EmployeeCard from "../common/EmployeeCard";
import Typography from "@material-ui/core/Typography";
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
        [
            "Office Location",
            employee.officeLocation.split(" ||| ").sort().join(", "),
        ],
        ["Physical Location", employee.physicalLocation],
        ["Hire Date", employee.hireDate.split(" ")[0]],
    ];

    return (
        <ContainerDiv>
            <CardContainer>
                <EmployeeCard employee={employee} linkToProfile={false} />
            </CardContainer>
            <div className="heading">
                Core Information{employee.isContractor && " (Contractor)"}
            </div>
            <StyledTypography
                variant="body1"
                color="textPrimary"
                // @ts-ignore
                component="p"
                data-cy="core-info-content"
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
