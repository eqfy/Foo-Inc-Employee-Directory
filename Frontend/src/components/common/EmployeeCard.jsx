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
        "&:hover": {
            cursor: "pointer",
            boxShadow: "0 0 3px 3px black",
        }
    },
    cardMedia: {
        width: 160,
        height: 160,
        margin: "auto",
    }
});

export default function EmployeeCard(props) {
    const { employee } = props;
    const classes = useStyles();

    return (
        <Card classes={{root: classes.card }}>
            <StyledLink to={`${PagePathEnum.PROFILE}/${employee.employeeId}`}>
                <EmployeeCardContentContainer>
                    <PositionedCardContentDiv>
                    <PositionOrgChartIconDiv>
                        <Link to={`${PagePathEnum.ORGCHART}/${employee.employeeId}`}>
                            <StyledOrgChartIcon />
                        </Link>
                    </PositionOrgChartIconDiv>
                    <CardMedia image={employee.image} classes={{ root: classes.cardMedia }} />
                    <Typography
                        variant="body1"
                        color="textPrimary"
                        component="p"
                    >
                        <b>Name:</b>{" "}
                        {`${employee.firstName} ${employee.lastName}`}
                        <br />
                        <b>Title:</b> {employee.title}
                        <br />
                    </Typography>
                    </PositionedCardContentDiv>
                </EmployeeCardContentContainer>
            </StyledLink>
        </Card>
    );
}

const EmployeeCardContentContainer = styled(CardContent)`
    max-width: 250px;
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
    left: calc(93% - 5px);
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
    margin: auto;
`;

const StyledLink = styled(Link)`
    &:hover {
        text-decoration: none;
    }
`;