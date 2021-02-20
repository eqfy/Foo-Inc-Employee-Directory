import React from "react";
import { ArrowLeft, ArrowRight } from "@material-ui/icons";
import styled from "styled-components";
import LinkButton from "components/common/LinkButton";
import "components/common/Common.css";

const previousButton = (index, employees) => {
    let prevEmployeeId;
    if (employees && index > 0) {
        prevEmployeeId = employees[index - 1].employeeId;
    }

    return (
        <LinkButton
            styles="padding-left: 0;"
            to={`/profile/${prevEmployeeId}`}
            disabled={!prevEmployeeId}
        >
            <ArrowLeft />
            Previous
        </LinkButton>
    );
};

const nextButton = (index, employees) => {
    let nextEmployeeId;
    if (employees && index + 1 < employees.length) {
        nextEmployeeId = employees[index + 1].employeeId;
    }

    return (
        <LinkButton
            styles="padding-right: 0;"
            to={`/profile/${nextEmployeeId}`}
            disabled={!nextEmployeeId}
        >
            Next
            <ArrowRight />
        </LinkButton>
    );
};

function PrevNextButtons(props) {
    const { index, employees } = props;

    return (
        <Container className="flex">
            {previousButton(index, employees)}
            <Separator />
            {nextButton(index, employees)}
        </Container>
    );
}

export default PrevNextButtons;

const Container = styled.div`
    height: 30px;
    margin-right: 18px;
`;

const Separator = styled.div`
    width: 1px;
    border-right: 1px solid black;
    margin: 0 4px;
`;
