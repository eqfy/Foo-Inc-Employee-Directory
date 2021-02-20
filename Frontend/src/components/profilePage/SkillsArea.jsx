import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { Button, Typography } from "@material-ui/core";
import "./ProfilePage.css";

const parseSkills = (skills) => {
    if (!skills) {
        return "No skills";
    }

    const skillArray = skills.split(", ");
    return skillArray.map((fullSkill) => {
        /**
         * 2/20/21
         * 
         * This parsing is subject to change with the backend implementation.
         * Any changes to the formatting of skills should be reflected in the mocks.
         */
        const [skillCategory, skill] = fullSkill.split(": ");
        return (
            <div>
                <StyledSpan>
                    {skillCategory}
                    {": "}
                </StyledSpan>
                {skill}
            </div>
        );
    });
};

function SkillsArea(props) {
    const { employee } = props;
    return (
        <ContainerDiv>
            <StyledHeading className="heading">
                Skills
                {/* TODO: Implement search functionality */}
                <SkillButton variant="contained" disableElevation>
                    Search with these skills
                </SkillButton>
            </StyledHeading>
            <StyledTypography
                variant="body1"
                color="textPrimary"
                // @ts-ignore
                component="p"
            >
                {parseSkills(employee.skills)}
            </StyledTypography>
        </ContainerDiv>
    );
}

const ContainerDiv = styled.div`
    width: 100%;
    height: 100%;
    margin-left: 30px;
`;

const StyledTypography = styled(Typography)`
    && {
        font-size: 18px;
        margin-left: 18px;
    }
`;

const StyledSpan = styled.span`
    color: #0663d0;
`;

const StyledHeading = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;

    && {
        margin-top: 0px;
    }
`;

const SkillButton = styled(Button)`
    && {
        background-color: white;
        color: #1c83fb;
        text-transform: none;
    }
`;

export default connect()(SkillsArea);
