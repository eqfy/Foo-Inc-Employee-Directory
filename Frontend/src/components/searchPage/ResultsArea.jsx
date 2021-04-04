import React, { useEffect, useState } from "react";
import EmployeeCard from "../common/EmployeeCard";
import Pagination from "@material-ui/lab/Pagination";
import styled from "styled-components";
import "../common/Common.css";
import { setPageAction } from "actions/searchAction";
import { connect } from "react-redux";
import Fade from "@material-ui/core/Fade";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { setFocusedWorkerId } from "actions/generalAction";

const entriesPerPage = 8;

const gridWidth = 260;
const gridHeight = 265;

const useStyles = makeStyles({
    loading: {
        color: "#00569c",
    },
    gridContainer: {
        width: gridWidth * 4,
        marginLeft: "auto",
        marginRight: "auto",
    },
});

function ResultsArea(props) {
    const {
        pageNumber,
        updatePage,
        resultOrder,
        workers: { byId },
        loading,
        setFocusedWorkerId,
    } = props;

    const [selectedIndexOnPage, setSelectedIndexOnPage] = useState(-1);

    useEffect(() => {
        setSelectedIndexOnPage(-1);
    }, [loading]);

    const handleChange = (_event, value) => {
        updatePage(value);
    };

    const styles = useStyles();

    const emptyDiv = () => {
        return <div style={{ height: gridHeight }}></div>;
    };

    const getEmployee = (index) => {
        if (offset + index < resultOrder.length) {
            const employeeId = resultOrder[offset + index];
            const employee = employeeId && byId[employeeId];
            return employee ? (
                <EmployeeCard
                    employee={employee}
                    linkToProfile={true}
                    cardIndexOnPage={index}
                    selectedIndexOnPage={selectedIndexOnPage}
                    setSelectedIndexOnPage={setSelectedIndexOnPage}
                    setFocusedWorkerId={setFocusedWorkerId}
                />
            ) : (
                emptyDiv()
            );
        }
        return emptyDiv();
    };

    const offset = (pageNumber - 1) * entriesPerPage;
    const employeeList = [];

    for (let i = 0; i < entriesPerPage; i++) {
        const employee = getEmployee(i);
        employeeList.push(
            <Grid item xs={3} key={i}>
                {employee}
            </Grid>
        );
    }

    return (
        <LoadingResult loading={loading} hasResult={resultOrder.length > 0}>
            <div
                onClick={() => {
                    setSelectedIndexOnPage(-1);
                }}
            >
                <Grid
                    container
                    spacing={2}
                    justify="center"
                    classes={{ root: styles.gridContainer }}
                >
                    {employeeList}
                    <Grid item xs={12}>
                        <StyledPagination
                            count={Math.max(
                                Math.ceil(resultOrder.length / entriesPerPage),
                                1
                            )}
                            page={pageNumber}
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
            Sorry, no employee or contractor satisfies the filters.
            <br />
            Please try unchecking some filters or lowering the minimum work
            experience filter
            <br />
            (currently, the most senior employee has 11 years of experience)
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
    loading: state.appState.filtersChanged,
});

const mapDispatchToProps = (dispatch) => ({
    updatePage: (value) => dispatch(setPageAction(value)),
    setFocusedWorkerId: (focusedWorkerId) =>
        dispatch(setFocusedWorkerId(focusedWorkerId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ResultsArea);
