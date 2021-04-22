import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import { Link, useHistory } from "react-router-dom";
import styled from "styled-components";
import OrgChartIcon from "./OrgChartIcon";
import "../common/Common.css";
import React, { useEffect } from "react";
import { PagePathEnum } from "./constants";
import CopyToClipboard from "react-copy-to-clipboard";
import {
    setFocusedWorkerId,
    setProfileLinkedToSearchResults,
    setSnackbarState,
} from "actions/generalAction";
import { connect } from "react-redux";

const useStyles = makeStyles({
    card: {
        userSelect: "none",
        width: 240,
        height: 260,
        borderWidth: 1,
        borderRadius: 25,
        borderColor: "black",
        marginLeft: "auto",
        marginRight: "auto",
        "&.contractor-card": {
            borderColor: "#FF9900",
        },
        "&.link-to-profile:hover": {
            boxShadow: "0 0 3px 3px black",
            cursor: "pointer",
            "&.contractor-card": {
                boxShadow: "0 0 3px 3px #CC7A00",
            },
        },
    },
    cardContent: {
        overflow: "hidden",
    },
    cardMedia: {
        width: 140,
        height: 140,
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: 6,
        marginBottom: 5,
        borderRadius: 20,
    },
    copyButton: {
        color: "#C4C4C4",
        width: 16,
        height: 16,
        transition: "color 0.25s",
        "&:hover": {
            color: "midnightblue",
            cursor: "pointer",
        },
        display: "inline-block",
        marginTop: "auto",
        marginBottom: "auto",
        marginLeft: 5,
    },
    checkIcon: {
        color: "green",
        width: 16,
        height: 16,
        display: "inline-block",
        marginTop: "auto",
        marginBottom: "auto",
        marginLeft: 5,
    },
    textCopyContainer: {
        display: "flex",
        justifyContent: "center",
        verticalAlign: "middle",
        "& > span": {
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
        },
        "&.textExtension": {
            position: "absolute",
            left: 17,
            zIndex: 30,
            whiteSpace: "nowrap",
            opacity: 0,
            transition: "opacity 0.5s ease",
            textAlign: "center",
            backgroundColor: "white",
            visibility: "hidden",
            ".card-text-too-long + &": {
                visibility: "visible",
                opacity: 0,
                "&:hover": {
                    opacity: 1,
                },
            },
            // name
            "&:nth-child(3)": {
                bottom: 22 + 24 * 2,
            },
            // title
            "&:nth-child(5)": {
                bottom: 22 + 24,
            },
            // email
            "&:nth-child(7)": {
                bottom: 22,
            },
        },
    },
});

function EmployeeCard(props) {
    // linkToProfile: employeeCard in profile page does not need to redirect to itself
    const {
        employee,
        linkToProfile,
        setSnackbarState,
        setProfileLinkedToSearchResults,
        setFocusedWorkerId,
    } = props;
    const classes = useStyles();

    const history = useHistory();

    const getText = (type, content, fullText) => {
        return (
            <div
                className={`${classes.textCopyContainer} ${
                    fullText ? "textExtension" : ""
                } card-${type.toLowerCase()}-${employee.employeeNumber}`}
            >
                <Typography
                    variant="body1"
                    color="textPrimary"
                    component="span"
                    data-cy={`employee-card-${type.toLowerCase()}`}
                >
                    <b>{type}: </b>
                    <span>{content}</span>
                </Typography>
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
                    <FileCopyIcon
                        classes={{ root: classes.copyButton }}
                        onClick={(e) => e.stopPropagation()}
                    />
                </CopyToClipboard>
            </div>
        );
    };

    useEffect(() => {
        // set classes based on whether texts are hidden
        const nameContainer = document.getElementsByClassName(
            `card-name-${employee.employeeNumber}`
        )[0];
        const nameText = nameContainer.getElementsByTagName("span")[0];
        if (nameText.clientWidth < nameText.scrollWidth) {
            nameContainer.classList.add("card-text-too-long");
        }

        const titleContainer = document.getElementsByClassName(
            `card-title-${employee.employeeNumber}`
        )[0];
        const titleText = titleContainer.getElementsByTagName("span")[0];
        if (titleText.clientWidth < titleText.scrollWidth) {
            titleContainer.classList.add("card-text-too-long");
        }

        const emailContainer = document.getElementsByClassName(
            `card-email-${employee.employeeNumber}`
        )[0];
        const emailText = emailContainer.getElementsByTagName("span")[0];
        if (emailText.clientWidth < emailText.scrollWidth) {
            emailContainer.classList.add("card-text-too-long");
        }
    }, [employee.employeeNumber]);

    const employeeCardContent = (
        <CardContent
            classes={{ root: classes.cardContent }}
            onClick={(e) => {
                if (linkToProfile) {
                    setFocusedWorkerId(employee.employeeNumber);
                    setProfileLinkedToSearchResults(true);
                    history.push(
                        `${PagePathEnum.PROFILE}/${employee.employeeNumber}`
                    );
                }
            }}
        >
            <CardMedia
                image={employee.image || "/workerPlaceholder.png"}
                classes={{ root: classes.cardMedia }}
            />
            {getText(
                "Name",
                `${employee.firstName} ${employee.lastName}`,
                false
            )}
            {getText(
                "Name",
                `${employee.firstName} ${employee.lastName}`,
                true
            )}
            {getText("Title", employee.title, false)}
            {getText("Title", employee.title, true)}
            {getText("Email", employee.email, false)}
            {getText("Email", employee.email, true)}
        </CardContent>
    );
    return (
        <CardContainer data-cy="employee-card">
            <Card
                className={`${linkToProfile ? "link-to-profile" : ""} ${
                    employee.isContractor ? "contractor-card" : ""
                }`}
                classes={{ root: classes.card }}
                variant="outlined"
            >
                <PositionOrgChartIconDiv>
                    <Link
                        to={`${PagePathEnum.ORGCHART}/${employee.employeeNumber}`}
                        onClick={() => {
                            setFocusedWorkerId(employee.employeeNumber);
                            setProfileLinkedToSearchResults(true);
                        }}
                    >
                        <StyledOrgChartIcon
                            workerId={employee.employeeNumber}
                        />
                    </Link>
                </PositionOrgChartIconDiv>
                {employeeCardContent}
            </Card>
        </CardContainer>
    );
}

const mapDispatchToProps = (dispatch) => ({
    setSnackbarState: (snackbarState) =>
        dispatch(setSnackbarState(snackbarState)),
    setProfileLinkedToSearchResults: (profileLinkedToSearchResults) =>
        dispatch(setProfileLinkedToSearchResults(profileLinkedToSearchResults)),
    setFocusedWorkerId: (workerId) => dispatch(setFocusedWorkerId(workerId)),
});

export default connect(null, mapDispatchToProps)(EmployeeCard);

const PositionOrgChartIconDiv = styled.div`
    position: relative;
    left: 86%;
    top: 26px;
    width: 0;
    height: 0;
`;

const StyledOrgChartIcon = styled(OrgChartIcon)`
    position: absolute;
`;

// This is to provide the absolute elements a coordination, and not hiding them
const CardContainer = styled.div`
    position: relative;
    display: inline-block;
`;
