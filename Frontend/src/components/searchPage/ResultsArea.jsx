import React from "react";
import EmployeeCard from "../common/EmployeeCard";
import { Pagination } from "@material-ui/lab";
import styled from "styled-components";
import "../common/Common.css";
import { setPageAction } from "actions/searchAction";
import { connect } from "react-redux";
import Fade from "@material-ui/core/Fade";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
    createMuiTheme,
    Grid,
    makeStyles,
    ThemeProvider,
} from "@material-ui/core";

const entriesPerPage = 8;

const gridWidth = 260;

const useStyles = makeStyles((theme) => ({
    loading: {
        color: "#00569c",
    },
    gridContainer: {
        marginLeft: "auto",
        marginRight: "auto",
        [theme.breakpoints.only("xs")]: {
            width: gridWidth,
        },
        [theme.breakpoints.only("sm")]: {
            width: gridWidth * 2,
        },
        [theme.breakpoints.only("md")]: {
            width: gridWidth * 3,
        },
        [theme.breakpoints.up("lg")]: {
            width: gridWidth * 4,
        },
    },
}));

function ResultsArea(props) {
    const {
        pageNumber,
        updatePage,
        resultOrder,
        workers: { byId },
        loading,
    } = props;

    const handleChange = (_event, value) => {
        updatePage(value);
    };

    const styles = useStyles();

    const emptyDiv = () => {
        return <div style={{ height: 265 }}></div>;
    };

    const getEmployee = (index) => {
        if (index < resultOrder.length) {
            const employeeId = resultOrder[index];
            const employee = employeeId && byId[employeeId];
            return (
                // <div className="card-grid-col">
                employee ? (
                    <EmployeeCard employee={employee} linkToProfile={true} />
                ) : (
                    emptyDiv()
                )
                // </div>
            );
        }
        return emptyDiv();
    };

    const offset = (pageNumber - 1) * entriesPerPage;
    const employeeList = [];

    for (let i = 0; i < entriesPerPage; i++) {
        const employee = getEmployee(offset + i);
        employeeList.push(
            <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                {employee}
            </Grid>
        );
    }

    return (
        <LoadingResult loading={loading} hasResult={resultOrder.length > 0}>
            <Grid
                container
                spacing={2}
                classes={{ root: styles.gridContainer }}
                justify="center"
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
});

export default connect(mapStateToProps, mapDispatchToProps)(ResultsArea);
