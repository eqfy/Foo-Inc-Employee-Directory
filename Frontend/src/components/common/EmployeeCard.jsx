import { Card, CardContent, CardMedia, makeStyles, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import styled from "styled-components";
import OrgChartIcon from "./OrgChartIcon";
import "../common/Common.css";
import React from "react";
import { PagePathEnum } from './constants';

const useStyles = makeStyles({
    card: {
        width: 250,
        height: 275,
        borderRadius: 25,
        borderWidth: 4,
        borderColor: "black",
        marginLeft: "auto",
        marginRight: "auto",
        "&.link-to-profile:hover": {
            cursor: "pointer",
            boxShadow: "0 0 3px 3px black",
        }
    },
    cardMedia: {
        width: 160,
        height: 160,
        marginLeft: "auto",
        marginRight: "auto",
        marginBottom: 5,
    },
    cardText: {
        textOverflow: "ellipsis",
        overflow: "hidden",
        whiteSpace: "nowrap",
    }
});

export default function EmployeeCard(props) {
    // linkToProfile: employeeCard in profile page does not need to redirect to itself
    const { employee, linkToProfile } = props;
    const classes = useStyles();

    const employeeCardContent = 
    (
        <EmployeeCardContentContainer>
                    <PositionedCardContentDiv>
                    <CardMedia image={employee.image} classes={{ root: classes.cardMedia }} />
                    <Typography
                        variant="body1"
                        color="textPrimary"
                        component="p"
                        classes={{ root: classes.cardText }}
                    >
                        <b>Name:</b>{" "}
                        {`${employee.firstName} ${employee.lastName}`}
                    </Typography>
                    <Typography
                        variant="body1"
                        color="textPrimary"
                        component="p"
                        classes={{ root: classes.cardText }}>
                            <b>Title:</b> {employee.title}
                    </Typography>
                    </PositionedCardContentDiv>
                </EmployeeCardContentContainer>
    );

    return (
        <Card className={linkToProfile ? "link-to-profile" : ""} classes={{root: classes.card }}>
            <PositionOrgChartIconDiv>
                <Link to={`${PagePathEnum.ORGCHART}/${employee.employeeNumber}`}>
                    <StyledOrgChartIcon />
                </Link>
            </PositionOrgChartIconDiv>
            {linkToProfile ? <StyledLink to={`${PagePathEnum.PROFILE}/${employee.employeeNumber}`}>
                {employeeCardContent}
            </StyledLink> : employeeCardContent}
        </Card>
    );
}

const EmployeeCardContentContainer = styled(CardContent)`
    height: 275px;
    width: 100%;
    border: 1px solid #000000;
    box-sizing: border-box;
    border-radius: 25px;
    padding: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    > * {
        width: 100%;
        text-align: center;
    }
`;

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

const PositionedCardContentDiv = styled.div`

`;

const StyledLink = styled(Link)`
    &:hover, &:not(:hover) {
        text-decoration: none;
    }

`;