import React from "react";
import { ArrowLeft, ArrowRight } from "@material-ui/icons";
import styled from "styled-components";
import LinkButton from "components/common/LinkButton";
import "components/common/Common.css";
import { PagePathEnum } from 'components/common/constants';
import { makeStyles } from '@material-ui/core';

const usePrevStyles = makeStyles({
    root: {
        paddingLeft: 0
    }
});

const useNextStyles = makeStyles({
    root: {
        paddingRight: 0
    }
});

const previousButton = (index, employees, classes) => {
    let prevEmployeeId;
    if (employees && index > 0) {
        prevEmployeeId = employees[index - 1].employeeId;
    }

    return (
        <LinkButton
            classes={classes}
            to={`${PagePathEnum.PROFILE}/${prevEmployeeId}`}
            disabled={!prevEmployeeId}
        >
            <ArrowLeft />
            Previous
        </LinkButton>
    );
};

const nextButton = (index, employees, classes) => {
    let nextEmployeeId;
    if (employees && index + 1 < employees.length) {
        nextEmployeeId = employees[index + 1].employeeId;
    }

    return (
        <LinkButton
            classes={classes}
            to={`${PagePathEnum.PROFILE}/${nextEmployeeId}`}
            disabled={!nextEmployeeId}
        >
            Next
            <ArrowRight />
        </LinkButton>
    );
};

function PrevNextButtons(props) {
    const { index, employees } = props;
    const classesPrev = usePrevStyles();
    const classesNext = useNextStyles();

    return (
        <Container className="flex">
            {previousButton(index, employees, classesPrev)}
            <Separator />
            {nextButton(index, employees, classesNext)}
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
