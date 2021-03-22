import React from "react";
import EmployeeCard from "../common/EmployeeCard";
import { Pagination } from "@material-ui/lab";
import styled from "styled-components";
import { useHistory, useLocation } from "react-router";
import "../common/Common.css";
import { setPageAction } from "actions/searchAction";
import { connect } from "react-redux";
import Fade from "@material-ui/core/Fade";
import CircularProgress from "@material-ui/core/CircularProgress";

const entriesPerPage = 6;

function ResultsArea(props) {
    const history = useHistory();
    const location = useLocation();
    const {
        pageNumber,
        updatePage,
        resultOrder,
        workers: { byId },
        loading,
    } = props;

    const handleChange = (_event, value) => {
        let params = new URLSearchParams(location.search);
        params.set("page", value);
        history.push({ search: params.toString() });
    };

    React.useEffect(() => {
        let params = new URLSearchParams(location.search);
        const page = Number(params.get("page"));

        // Sync Redux with URL page param
        if (page && page !== pageNumber) {
            updatePage(page);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

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
    return loading ? (
        <div
            style={{
                height: "590px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Fade
                in={loading}
                style={{
                    transitionDelay: loading ? "300ms" : "0ms",
                }}
                unmountOnExit
            >
                <CircularProgress size={"100px"} />
            </Fade>
        </div>
    ) : !hasResult ? (
        <div className={"orgchart-container"}>
            Sorry, there is no employee or contractor with matching id.
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
});

export default connect(mapStateToProps, mapDispatchToProps)(ResultsArea);
