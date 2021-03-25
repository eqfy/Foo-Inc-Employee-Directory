import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { Button, Typography, makeStyles } from "@material-ui/core";
import "./ProfilePage.css";

const useStyles = makeStyles({
    skillTitle: {
        color: "#0663d0",
        fontSize: "18px",
    },
    skillContent: {
        fontSize: "18px",
    },
});

const parseSkills = (skills, styles) => {
    if (!skills) {
        return "No skills";
    }

    const skillArray = skills.split(", ");
    return skillArray.map((fullSkill, index) => {
        /**
         * 2/20/21
         *
         * This parsing is subject to change with the backend implementation.
         * Any changes to the formatting of skills should be reflected in the mocks.
         */
        const [skillCategory, skill] = fullSkill.split(": ");
        return (
            <div key={`skill${index}`}>
                <StyledTypography
                    display="inline"
                    variant="body1"
                    color="textPrimary"
                    classes={{ root: styles.skillTitle }}
                >
                    {skillCategory}
                    {": "}
                </StyledTypography>
                <StyledTypography
                    display="inline"
                    variant="body1"
                    color="textPrimary"
                    classes={{ root: styles.skillContent }}
                >
                    {skill}
                </StyledTypography>
            </div>
        );
    });
};

function SkillsArea(props) {
    const { employee } = props;
    const styles = useStyles();

    return (
        <ContainerDiv>
            <StyledHeading className="heading">
                Skills
                {/* TODO: Implement search functionality */}
                <SkillButton variant="contained" disableElevation>
                    Search with these skills
                </SkillButton>
            </StyledHeading>
            <StyledSkillContainer>
                {parseSkills(employee.skills, styles)}
            </StyledSkillContainer>
        </ContainerDiv>
    );
}

const ContainerDiv = styled.div`
    width: 100%;
    height: 100%;
    margin-left: 30px;
`;

const StyledSkillContainer = styled.div`
    && {
        font-size: 18px;
        margin-left: 18px;
    }
`;

const StyledTypography = styled(Typography)`
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
