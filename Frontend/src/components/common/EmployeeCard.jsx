import {
    Card,
    CardContent,
    CardMedia,
    makeStyles,
    Typography,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import styled from "styled-components";
import OrgChartIcon from "./OrgChartIcon";
import "../common/Common.css";
import React, { useEffect } from "react";
import { PagePathEnum } from "./constants";

const useStyles = makeStyles({
    card: {
        width: 248,
        height: 270,
        borderWidth: 1,
        borderRadius: 25,
        borderColor: "black",
        marginLeft: "auto",
        marginRight: "auto",
        "&.link-to-profile:hover": {
            cursor: "pointer",
            boxShadow: "0 0 3px 3px black",
        },
    },
    cardContent: {
        overflow: "hidden",
    },
    cardMedia: {
        width: 160,
        height: 160,
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: 10,
        marginBottom: 5,
        borderRadius: 20,
    },
    cardText: {
        textAlign: "center",
        textOverflow: "ellipsis",
        overflow: "hidden",
        whiteSpace: "nowrap",
        "&.card-text-too-long + p": {
            visibility: "visible",
            "&:hover": {
                opacity: 1,
            },
        },
    },
    // some of the pixels are hard-coded for now
    cardExtension: {
        whiteSpace: "nowrap",
        position: "absolute",
        left: 17,
        bottom: 32,
        zIndex: 30,
        opacity: 0,
        transition: "opacity 0.5s ease",
        textAlign: "center",
        backgroundColor: "white",
        visibility: "hidden",
        "&:nth-child(3)": {
            bottom: 32 + 24,
        },
    },
});

export default function EmployeeCard(props) {
    // linkToProfile: employeeCard in profile page does not need to redirect to itself
    const { employee, linkToProfile, handleProfileClick } = props;
    const classes = useStyles();

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
        </CardContent>
    );
    return (
        <CardContainer>
            <Card
                className={linkToProfile ? "link-to-profile" : ""}
                classes={{ root: classes.card }}
                variant="outlined"
            >
                <PositionOrgChartIconDiv>
                    <Link
                        to={`${PagePathEnum.ORGCHART}/${employee.employeeNumber}`}
                    >
                        <StyledOrgChartIcon />
                    </Link>
                </PositionOrgChartIconDiv>
                {linkToProfile ? (
                    <StyledLink
                        to={`${PagePathEnum.PROFILE}/${employee.employeeNumber}`}
                        onClick={handleProfileClick(employee.employeeNumber)}
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

const StyledLink = styled(Link)`
    &:hover,
    &:not(:hover) {
        text-decoration: none;
    }
`;

// This is to provide the absolute elements a coordination, and not hiding them
const CardContainer = styled.div`
    position: relative;
    display: inline-block;
`;
