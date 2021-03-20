import React from "react";
import { ArrowLeft, ArrowRight } from "@material-ui/icons";
import styled from "styled-components";
import LinkButton from "components/common/LinkButton";
import "components/common/Common.css";
import { PagePathEnum } from 'components/common/constants';
import { makeStyles } from '@material-ui/core';
import { connect } from 'react-redux';

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

const previousButton = (index, classes, resultOrder) => {
    let prevEmployeeId;
    if (resultOrder.length > 0 && index > 0) {
        prevEmployeeId = resultOrder[index - 1];
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

const nextButton = (index, classes, resultOrder) => {
    let nextEmployeeId;
    if (index !== -1 && index < resultOrder.length) {
        nextEmployeeId = resultOrder[index + 1];
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
    const { resultOrder, focusedWorkerId } = props;
    const classesPrev = usePrevStyles();
    const classesNext = useNextStyles();

    const [index, setIndex] = React.useState(-1);

    React.useEffect(() => {
        const temp = resultOrder.findIndex((workerId) => workerId === focusedWorkerId);
        setIndex(temp);
    }, [focusedWorkerId]);

    return (
        <Container className="flex">
            {previousButton(index, classesPrev, resultOrder)}
            <Separator />
            {nextButton(index, classesNext, resultOrder)}
        </Container>
    );
}

const mapStateToProps = (state) => ({
    focusedWorkerId: state.appState.focusedWorkerId,
    resultOrder: state.searchPageState.resultOrder,
});

export default connect(mapStateToProps)(PrevNextButtons);

const Container = styled.div`
    height: 30px;
    margin-right: 18px;
`;

const Separator = styled.div`
    width: 1px;
    border-right: 1px solid black;
    margin: 0 4px;
`;
