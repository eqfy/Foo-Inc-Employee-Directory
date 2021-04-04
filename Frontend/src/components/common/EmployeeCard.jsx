import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import { Link, useHistory } from "react-router-dom";
import styled from "styled-components";
import OrgChartIcon from "./OrgChartIcon";
import "../common/Common.css";
import React, { useEffect } from "react";
import { PagePathEnum } from "./constants";

const useStyles = makeStyles({
    card: {
        width: 240,
        height: 260,
        borderWidth: 1,
        borderRadius: 25,
        borderColor: "black",
        marginLeft: "auto",
        marginRight: "auto",
        "&.link-to-profile:hover": {
            boxShadow: "0 0 3px 3px black",
        },
        "&.link-to-profile.cardSelected": {
            boxShadow: "0 0 3px 3px black",
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
    cardText: {
        textAlign: "center",
        textOverflow: "ellipsis",
        overflow: "hidden",
        whiteSpace: "nowrap",
        transition: "opacity 0.5s ease",
        opacity: 1,
        cursor: "text",
        "&.card-text-too-long + p": {
            visibility: "visible",
            "&:hover": {
                opacity: 1,
            },
        },
        ".cardSelected &.card-text-too-long + p": {
            opacity: 1,
        },
    },

    cardExtension: {
        whiteSpace: "nowrap",
        position: "absolute",
        left: 17,
        zIndex: 30,
        opacity: 0,
        transition: "opacity 0.5s ease",
        textAlign: "center",
        backgroundColor: "white",
        visibility: "hidden",
        cursor: "text",
        "&:nth-child(3)": {
            bottom: 22 + 24 * 2,
        },
        "&:nth-child(5)": {
            bottom: 22 + 24,
        },
        "&:nth-child(7)": {
            bottom: 22,
        },
    },
});

export default function EmployeeCard(props) {
    // linkToProfile: employeeCard in profile page does not need to redirect to itself
    // offset: to set and identify current selected card
    const {
        employee,
        linkToProfile,
        cardIndexOnPage,
        selectedIndexOnPage,
        setSelectedIndexOnPage,
        setCardClicked,
    } = props;
    const classes = useStyles();

    const history = useHistory();

    useEffect(() => {
        const nameTextTypography = document.getElementsByClassName(
            `card-name-${employee.employeeNumber}`
        )[0];

        if (nameTextTypography.clientWidth < nameTextTypography.scrollWidth) {
            nameTextTypography.classList.add("card-text-too-long");
        }

        const titleTextTypography = document.getElementsByClassName(
            `card-title-${employee.employeeNumber}`
        )[0];

        if (titleTextTypography.clientWidth < titleTextTypography.scrollWidth) {
            titleTextTypography.classList.add("card-text-too-long");
        }

        const emailTextTypography = document.getElementsByClassName(
            `card-email-${employee.employeeNumber}`
        )[0];

        if (emailTextTypography.clientWidth < emailTextTypography.scrollWidth) {
            emailTextTypography.classList.add("card-text-too-long");
        }
    }, [employee.employeeNumber]);

    const employeeCardContent = (
        <CardContent classes={{ root: classes.cardContent }}>
            <CardMedia
                image={employee.image || "/workerPlaceholder.png"}
                classes={{ root: classes.cardMedia }}
            />
            <Typography
                variant="body1"
                color="textPrimary"
                component="p"
                classes={{ root: classes.cardText }}
                className={`card-name-${employee.employeeNumber}`}
            >
                <b>Name: </b>
                <span>{`${employee.firstName} ${employee.lastName}`}</span>
            </Typography>
            <Typography
                variant="body1"
                color="textPrimary"
                component="p"
                classes={{ root: classes.cardExtension }}
            >
                <b>Name: </b>
                <span>{`${employee.firstName} ${employee.lastName}`}</span>
            </Typography>
            <Typography
                variant="body1"
                color="textPrimary"
                component="p"
                classes={{ root: classes.cardText }}
                className={`card-title-${employee.employeeNumber}`}
            >
                <b>Title: </b>
                <span>{employee.title}</span>
            </Typography>
            <Typography
                variant="body1"
                color="textPrimary"
                component="p"
                classes={{ root: classes.cardExtension }}
            >
                <b>Title: </b>
                <span>{`${employee.title}`}</span>
            </Typography>
            <Typography
                variant="body1"
                color="textPrimary"
                component="p"
                classes={{ root: classes.cardText }}
                className={`card-email-${employee.employeeNumber}`}
            >
                <b>Email: </b>
                <span>{employee.email}</span>
            </Typography>
            <Typography
                variant="body1"
                color="textPrimary"
                component="p"
                classes={{ root: classes.cardExtension }}
            >
                <b>Email: </b>
                <span>{`${employee.email}`}</span>
            </Typography>
        </CardContent>
    );
    return (
        <CardContainer data-cy="employee-card">
            <Card
                className={`${linkToProfile ? "link-to-profile" : ""} ${
                    cardIndexOnPage === selectedIndexOnPage
                        ? "cardSelected"
                        : ""
                }`}
                classes={{ root: classes.card }}
                variant="outlined"
                onClick={() => {
                    if (setCardClicked && setSelectedIndexOnPage) {
                        setCardClicked(true);
                        setSelectedIndexOnPage(cardIndexOnPage);
                    }
                }}
                onDoubleClick={() => {
                    if (linkToProfile) {
                        history.push(
                            `${PagePathEnum.PROFILE}/${employee.employeeNumber}`
                        );
                    }
                }}
            >
                <PositionOrgChartIconDiv>
                    <Link
                        to={`${PagePathEnum.ORGCHART}/${employee.employeeNumber}`}
                    >
                        <StyledOrgChartIcon
                            workerId={employee.employeeNumber}
                        />
                    </Link>
                </PositionOrgChartIconDiv>
                {linkToProfile ? (
                    <StyledLink
                        to={`${PagePathEnum.PROFILE}/${employee.employeeNumber}`}
                    >
                        {employeeCardContent}
                    </StyledLink>
                ) : (
                    <div>{employeeCardContent}</div>
                )}
            </Card>
        </CardContainer>
    );
}

const PositionOrgChartIconDiv = styled.div`
    position: relative;
    left: 86%;
    top: 26px;
    width: 0;
    height: 0;
`;

const StyledOrgChartIcon = styled(OrgChartIcon)`
    position: absolute;
    rect {
        transition: fill 0.25s;
    }
    &:hover {
        rect {
            fill: midnightblue;
        }
    }
`;

const StyledLink = styled.div`
    &:hover {
        text-decoration: none;
        cursor: default;
    }
    &:not(:hover) {
        text-decoration: none;
    }
`;

// This is to provide the absolute elements a coordination, and not hiding them
const CardContainer = styled.div`
    position: relative;
    display: inline-block;
`;
