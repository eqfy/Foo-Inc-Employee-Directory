import React from "react";
import "../common/Common.css";
import {
    ResultEntryCountListGridRatio,
    ResultEntryPerPage,
} from "states/searchPageState";
import styled from "styled-components";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import CardMedia from "@material-ui/core/CardMedia";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { useHistory } from "react-router-dom";
import { PagePathEnum } from "../common/constants";
import {
    setFocusedWorkerId,
    setProfileLinkedToSearchResults,
    setSnackbarState,
} from "actions/generalAction";
import { connect } from "react-redux";
import OrgChartIcon from "components/common/OrgChartIcon";
import CopyToClipboard from "react-copy-to-clipboard";

const rowHeight = 32;

const useStyles = makeStyles({
    pContainer: {
        display: "flex",
        verticalAlign: "middle",
    },
    tableContainer: {
        marginTop: 8,
        marginBottom: 9,
        minHeight: 547,
        "& p": {
            display: "inline-block",
        },
    },
    headRow: {
        "&&": {
            fontWeight: "700",
            paddingLeft: 0,
            paddingBottom: 5,
            paddingTop: 5,
        },
    },
    row: {
        height: rowHeight,
        "& td": {
            padding: 0,
        },
        "& p": {
            transition: "color 0.25s",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            margin: 0,
            "&:hover": {
                color: "#1C83FB",
            },
        },
        "&.contractorRow p:hover": {
            color: "#FF9900",
        },
        transition: "background-color 0.25s",
        "&:hover": {
            cursor: "pointer",
            backgroundColor: "rgba(0, 0, 0, 0.08)",
        },
    },
    image: {
        width: 24,
        height: 24,
        borderRadius: 3,
        display: "inline-block",
    },
    nameContainer: {
        display: "flex",
        alignItems: "center",
        "& p": {
            maxWidth: 200,
            display: "inline-block",
            marginLeft: 10,
            marginRight: 10,
        },
    },
    name: {
        minWidth: 270,
    },
    contractorName: {
        backgroundColor: "#FF9900",
        width: 8,
        height: 8,
        borderRadius: 4,
        display: "inline-block",
    },
    title: {
        minWidth: 200,
        alignItems: "center",
        "& p": {
            maxWidth: 200,
        },
    },
    email: {
        minWidth: 250,
        "& p": {
            maxWidth: 250,
        },
    },
    phone: {
        minWidth: 150,
        "& p": {
            maxWidth: 150,
        },
    },
    division: {
        minWidth: 150,
        "& p": {
            maxWidth: 150,
        },
    },
    location: {
        minWidth: 150,
        "& p": {
            maxWidth: 150,
        },
    },
});

function CopyableP(props) {
    const { content, setSnackbarState } = props;

    const classes = useStyles();

    return (
        <div className={classes.pContainer}>
            <CopyToClipboard
                text={content}
                onCopy={() => {
                    setSnackbarState({
                        open: true,
                        severity: "success",
                        message: "Successfully copied",
                    });
                }}
            >
                <p onClick={(e) => e.stopPropagation()}>{content}</p>
            </CopyToClipboard>
        </div>
    );
}

function ResultsAreaListView(props) {
    const {
        pageNumber,
        resultOrder,
        byId,
        setSnackbarState,
        setProfileLinkedToSearchResults,
        setFocusedWorkerId,
    } = props;

    const offset =
        (Math.ceil(pageNumber / ResultEntryCountListGridRatio) - 1) *
        ResultEntryPerPage *
        ResultEntryCountListGridRatio;
    const employeeList = [];

    const history = useHistory();

    const classes = useStyles();

    const getEmployee = (index) => {
        if (offset + index < resultOrder.length) {
            const employeeId = resultOrder[offset + index];
            const employee = employeeId && byId[employeeId];
            return employee ? (
                <TableRow
                    classes={{ root: classes.row }}
                    className={employee.isContractor ? "contractorRow" : ""}
                    onClick={(e) => {
                        setFocusedWorkerId(employee.employeeNumber);
                        setProfileLinkedToSearchResults(true);
                        history.push(
                            `${PagePathEnum.PROFILE}/${employee.employeeNumber}`
                        );
                    }}
                >
                    <TableCell classes={{ root: classes.name }}>
                        <div className={classes.nameContainer}>
                            <CardMedia
                                image={
                                    employee.image || "/workerPlaceholder.png"
                                }
                                classes={{ root: classes.image }}
                            />
                            <CopyableP
                                content={`${employee.firstName} ${employee.lastName}`}
                                setSnackbarState={setSnackbarState}
                            />
                            {employee.isContractor ? (
                                <div className={classes.contractorName}></div>
                            ) : null}
                        </div>
                    </TableCell>
                    <TableCell classes={{ root: classes.title }}>
                        <CopyableP
                            content={employee.title}
                            setSnackbarState={setSnackbarState}
                        />
                    </TableCell>
                    <TableCell classes={{ root: classes.email }}>
                        <CopyableP
                            content={employee.email}
                            setSnackbarState={setSnackbarState}
                        />
                    </TableCell>
                    <TableCell classes={{ root: classes.phone }}>
                        <CopyableP
                            content={employee.workPhone}
                            setSnackbarState={setSnackbarState}
                        />
                    </TableCell>
                    <TableCell classes={{ root: classes.division }}>
                        <CopyableP
                            content={employee.division}
                            setSnackbarState={setSnackbarState}
                        />
                    </TableCell>
                    <TableCell classes={{ root: classes.location }}>
                        <CopyableP
                            content={employee.physicalLocation}
                            setSnackbarState={setSnackbarState}
                        />
                    </TableCell>
                    <TableCell>
                        <StyledOrgChartIcon
                            onClick={(e) => {
                                e.stopPropagation();
                                setFocusedWorkerId(employee.employeeNumber);
                                setProfileLinkedToSearchResults(true);
                                history.push(
                                    `${PagePathEnum.ORGCHART}/${employee.employeeNumber}`
                                );
                            }}
                        />
                    </TableCell>
                </TableRow>
            ) : null;
        }
        return null;
    };

    for (
        let i = 0;
        i < ResultEntryPerPage * ResultEntryCountListGridRatio;
        i++
    ) {
        const employee = getEmployee(i);
        employeeList.push(employee);
    }

    return (
        <div className={classes.tableContainer}>
            <Table aria-label="results area list">
                <TableHead>
                    <TableRow classes={{ root: classes.headRow }}>
                        <TableCell classes={{ root: classes.headRow }}>
                            Name
                        </TableCell>
                        <TableCell classes={{ root: classes.headRow }}>
                            Title
                        </TableCell>
                        <TableCell classes={{ root: classes.headRow }}>
                            Email
                        </TableCell>
                        <TableCell classes={{ root: classes.headRow }}>
                            Phone
                        </TableCell>
                        <TableCell classes={{ root: classes.headRow }}>
                            Division
                        </TableCell>
                        <TableCell classes={{ root: classes.headRow }}>
                            Location
                        </TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>{employeeList}</TableBody>
            </Table>
        </div>
    );
}

const mapDispatchToProps = (dispatch) => ({
    setSnackbarState: (snackbarState) =>
        dispatch(setSnackbarState(snackbarState)),
    setProfileLinkedToSearchResults: (profileLinkedToSearchResults) =>
        dispatch(setProfileLinkedToSearchResults(profileLinkedToSearchResults)),
    setFocusedWorkerId: (workerId) => dispatch(setFocusedWorkerId(workerId)),
});

export default connect(null, mapDispatchToProps)(ResultsAreaListView);

const StyledOrgChartIcon = styled(OrgChartIcon)`
    transform: matrix(0.7, 0, 0, 0.7, 0, 2);
    rect {
        transition: fill 0.25s;
    }
    &:hover {
        rect {
            fill: midnightblue;
        }
    }
`;
