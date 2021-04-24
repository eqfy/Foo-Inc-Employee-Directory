import React from "react";
import Pagination from "@material-ui/lab/Pagination";
import styled from "styled-components";
import "../common/Common.css";
import { setPageAction } from "actions/searchAction";
import { connect } from "react-redux";
import Fade from "@material-ui/core/Fade";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
    ResultEntryCountListGridRatio,
    ResultEntryPerPage,
} from "states/searchPageState";
import { setFocusedWorkerId } from "actions/generalAction";
import Grid from "@material-ui/core/Grid";
import makeStyles from "@material-ui/core/styles/makeStyles";
import ResultsAreaGridView from "./ResultsAreaGridView";
import ResultsAreaListView from "./ResultsAreaListView";

const gridWidth = 260;

const useStyles = makeStyles({
    gridContainer: {
        width: gridWidth * 4,
        marginLeft: "auto",
        marginRight: "auto",
    },
    loading: {
        color: "#00569c",
    },
});

function ResultsArea(props) {
    const {
        pageNumber,
        updatePage,
        resultOrder,
        isListView,
        workers: { byId },
        loading,
        setFocusedWorkerId,
    } = props;

    const handleChange = (_event, value) => {
        const targetValue = isListView
            ? ResultEntryCountListGridRatio * value - 1
            : value;
        if (targetValue !== pageNumber) {
            updatePage(targetValue);
        }
    };

    const styles = useStyles();

    return (
        <LoadingResult loading={loading} hasResult={resultOrder.length > 0}>
            <div>
                <Grid
                    container
                    spacing={2}
                    justify="center"
                    classes={{ root: styles.gridContainer }}
                >
                    {isListView ? (
                        // @ts-ignore
                        <ResultsAreaListView
                            pageNumber={pageNumber}
                            byId={byId}
                            resultOrder={resultOrder}
                            setFocusedWorkerId={setFocusedWorkerId}
                        />
                    ) : (
                        // @ts-ignore
                        <ResultsAreaGridView
                            pageNumber={pageNumber}
                            byId={byId}
                            resultOrder={resultOrder}
                            setFocusedWorkerId={setFocusedWorkerId}
                        />
                    )}
                    <Grid item xs={12}>
                        <StyledPagination
                            count={Math.max(
                                Math.ceil(
                                    resultOrder.length /
                                        ResultEntryPerPage /
                                        (isListView
                                            ? ResultEntryCountListGridRatio
                                            : 1)
                                ),
                                1
                            )}
                            siblingCount={3}
                            page={Math.ceil(
                                pageNumber /
                                    (isListView
                                        ? ResultEntryCountListGridRatio
                                        : 1)
                            )}
                            onChange={handleChange}
                        />
                    </Grid>
                </Grid>
            </div>
        </LoadingResult>
    );
}

function LoadingResult(props) {
    const { loading, hasResult } = props;
    const styles = useStyles();

    return loading ? (
        <div
            style={{
                height: "calc(100vh - 280px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Fade in={loading} unmountOnExit>
                <CircularProgress
                    size={"100px"}
                    classes={{ root: styles.loading }}
                    data-cy="loading-results"
                />
            </Fade>
        </div>
    ) : !hasResult ? (
        <div
            className={"orgchart-container"}
            style={{ height: "calc(100vh - 280px)" }}
        >
            Sorry, no results satisfy the applied filters.
            <br />
            Please try deleting some filters or lowering the minimum work
            experience filter.
        </div>
    ) : (
        props.children
    );
}

const StyledPagination = styled(Pagination)`
    > * {
        justify-content: center;
    }
`;

const mapStateToProps = (state) => ({
    workers: state.workers,
    resultOrder: state.searchPageState.resultOrder,
    pageNumber: state.searchPageState.pageNumber,
    isListView: state.searchPageState.isListView,
    loading:
        state.appState.filtersChanged || state.searchPageState.resultLoading,
    focusedWorkerId: state.appState.focusedWorkerId,
});

const mapDispatchToProps = (dispatch) => ({
    updatePage: (value) => dispatch(setPageAction(value)),
    setFocusedWorkerId: (workerId) => dispatch(setFocusedWorkerId(workerId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ResultsArea);
