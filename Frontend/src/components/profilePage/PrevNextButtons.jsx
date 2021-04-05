import React from "react";
import ArrowLeftIcon from "@material-ui/icons/ArrowLeft";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import styled from "styled-components";
import LinkButton from "components/common/LinkButton";
import "components/common/Common.css";
import { PagePathEnum } from "components/common/constants";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { connect } from "react-redux";
import {
    searchWithAppliedFilterAction,
    setPageAction,
} from "actions/searchAction";
import { ResultEntryPerPage } from "states/searchPageState";

const usePrevStyles = makeStyles({
    root: {
        paddingLeft: 0,
    },
});

const useNextStyles = makeStyles({
    root: {
        paddingRight: 0,
    },
});

const previousButton = (classes, prevWorkerId) => {
    return (
        <LinkButton
            classes={classes}
            to={`${PagePathEnum.PROFILE}/${prevWorkerId}`}
            disabled={!prevWorkerId}
        >
            <ArrowLeftIcon />
            Previous
        </LinkButton>
    );
};

const nextButton = (classes, nextWorkerId) => {
    return (
        <LinkButton
            classes={classes}
            to={`${PagePathEnum.PROFILE}/${nextWorkerId}`}
            disabled={!nextWorkerId}
        >
            Next
            <ArrowRightIcon />
        </LinkButton>
    );
};

function PrevNextButtons(props) {
    const {
        resultOrder,
        focusedWorkerId,
        pageNumber,
        searchWithAppliedFilterAction,
        updatePage,
    } = props;
    const classesPrev = usePrevStyles();
    const classesNext = useNextStyles();

    const validIndex = (i) => i >= 0 && i < resultOrder.length;
    const indexToPageNumber = (i) => Math.floor(i / ResultEntryPerPage) + 1;

    const index = resultOrder.findIndex(
        (workerId) => workerId === focusedWorkerId
    );

    const prevWorkerId = resultOrder[index - 1];
    const nextWorkerId = resultOrder[index + 1];
    React.useEffect(() => {
        if (!prevWorkerId && validIndex(index - 1)) {
            searchWithAppliedFilterAction(indexToPageNumber(index - 1));
        }
        if (!nextWorkerId && validIndex(index + 1)) {
            searchWithAppliedFilterAction(indexToPageNumber(index + 1));
        }
        if (indexToPageNumber(index) !== pageNumber) {
            updatePage(indexToPageNumber(index));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [index]);

    return (
        <Container className="flex">
            {previousButton(classesPrev, prevWorkerId)}
            <Separator />
            {nextButton(classesNext, nextWorkerId)}
        </Container>
    );
}

const mapStateToProps = (state) => ({
    focusedWorkerId: state.appState.focusedWorkerId,
    resultOrder: state.searchPageState.resultOrder,
    pageNumber: state.searchPageState.pageNumber,
});

const mapDispatchToProps = (dispatch) => ({
    searchWithAppliedFilterAction: (pageNumberOverride) =>
        dispatch(searchWithAppliedFilterAction(pageNumberOverride)),
    updatePage: (value) => dispatch(setPageAction(value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PrevNextButtons);

const Container = styled.div`
    height: 30px;
    margin-right: 18px;
`;

const Separator = styled.div`
    width: 1px;
    border-right: 1px solid black;
    margin: 0 4px;
`;
