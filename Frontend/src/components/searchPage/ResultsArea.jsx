import React from "react";
import EmployeeCard from "../common/EmployeeCard";
import { Pagination } from "@material-ui/lab";
import styled from "styled-components";
import "../common/Common.css";
import { setPageAction } from "actions/searchAction";
import { connect } from "react-redux";
import Fade from "@material-ui/core/Fade";
import CircularProgress from "@material-ui/core/CircularProgress";
import { setFocusedWorkerId } from "actions/generalAction";
import { makeStyles } from "@material-ui/core";

const entriesPerPage = 6;

const useStyles = makeStyles({
    loading: {
        color: "#00569c",
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

    const handleChange = (_event, value) => {
        updatePage(value);
    };

    const handleProfileClick = (workerId) => () => {
        setFocusedWorkerId(workerId);
    };

    const getEmployee = (index) => {
        if (index < resultOrder.length) {
            const employeeId = resultOrder[index];
            const employee = employeeId && byId[employeeId];
            return (
                <div className="card-grid-col">
                    {employee ? (
                        <EmployeeCard
                            employee={employee}
                            linkToProfile={true}
                            handleProfileClick={handleProfileClick}
                        />
                    ) : null}
                </div>
            );
        }
    };

    const offset = (pageNumber - 1) * entriesPerPage;
    return (
        <LoadingResult loading={loading} hasResult={resultOrder.length > 0}>
            <div className="card-grid">
                {getEmployee(offset + 0)}
                {getEmployee(offset + 1)}
                {getEmployee(offset + 2)}
            </div>
            <div className="card-grid">
                {getEmployee(offset + 3)}
                {getEmployee(offset + 4)}
                {getEmployee(offset + 5)}
            </div>
            <StyledPagination
                count={Math.max(Math.ceil(resultOrder.length / 6), 1)}
                page={pageNumber}
                onChange={handleChange}
            />
        </LoadingResult>
    );
}

function LoadingResult(props) {
    const { loading, hasResult } = props;
    const styles = useStyles();

    return loading ? (
        <div
            style={{
                height: "80%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Fade in={loading} unmountOnExit>
                <CircularProgress
                    size={"100px"}
                    classes={{ root: styles.loading }}
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
    setFocusedWorkerId: (workerId) => dispatch(setFocusedWorkerId(workerId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ResultsArea);
