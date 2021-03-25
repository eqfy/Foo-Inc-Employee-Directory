import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { Button, Typography, makeStyles, Chip } from "@material-ui/core";
import "./ProfilePage.css";
import { setProfileSkills } from "actions/profileAction";
import { searchWithAppliedFilterAction } from "actions/searchAction";
import { useHistory } from "react-router";
import { PagePathEnum } from "components/common/constants";

const useStyles = makeStyles({
    skillTitle: {
        color: "#1C83FB",
        fontSize: "18px",
    },
    skillChip: {
        fontSize: "18px",
        height: "36px",
        padding: "6px",
        margin: "5px",
        backgroundColor: "#1C83FB",
        color: "white",
        transition: "background-color ease 0.5s",
        "&:hover": {
            backgroundColor: "#00569C",
            cursor: "pointer",
        },
    },
});

const convertSkillArrayToSkillObject = (skillArray) => {
    const skillObject = {};
    skillArray.forEach((fullSkill) => {
        const [skillCategory, skill] = fullSkill.split(": ");
        if (skillObject[skillCategory]) {
            skillObject[skillCategory].push(skill);
        } else {
            skillObject[skillCategory] = [skill];
        }
    });

    return skillObject;
};

const parseSkills = (skills, styles, setProfileSkills, searchWithAppliedFilterAction, history) => {
    if (!skills) {
        return "No skills";
    }

    const skillArray = skills.split(", ");

    /**
     * 2/20/21
     *
     * This parsing is subject to change with the backend implementation.
     * Any changes to the formatting of skills should be reflected in the mocks.
     */

    // convert array to map
    const skillObject = convertSkillArrayToSkillObject(skillArray);

    const skillEntries = [];

    let categoryCounter = 0;
    for (const skillCategory in skillObject) {
        let skillCounter = 0;
        skillEntries.push(
            <tr key={`skillGroup${categoryCounter++}`}>
                <SkillCategoryTd>
                    <StyledTypography
                        display="inline"
                        variant="body1"
                        color="textPrimary"
                        classes={{ root: styles.skillTitle }}
                    >
                        {skillCategory}
                        {": "}
                    </StyledTypography>
                </SkillCategoryTd>
                <td>
                    {skillObject[skillCategory].map((skill) => {
                        return (
                            <Chip
                                label={skill}
                                classes={{ root: styles.skillChip }}
                                key={`skill${skillCounter++}`}
                                onClick={() => {
                                    const skills = {};
                                    skills[skillCategory] = [skill];
                                    setProfileSkills(skills);
                                    history.push(PagePathEnum.SEARCH);
                                    searchWithAppliedFilterAction();
                                    console.log('lll');
                                }}
                            />
                        );
                    })}
                </td>
            </tr>
        );
    }

    return (
        <table>
            <tbody>{skillEntries}</tbody>
        </table>
    );
};

function SkillsArea(props) {
    const { employee, setProfileSkills,searchWithAppliedFilterAction } = props;
    const styles = useStyles();
    const history = useHistory();

    return (
        <ContainerDiv>
            <StyledHeading className="heading">
                Skills
                {/* TODO: Implement search functionality */}
                <SkillButton
                    variant="contained"
                    disableElevation
                    onClick={() => {
                        if (employee.skills) {
                            setProfileSkills(
                                convertSkillArrayToSkillObject(
                                    employee.skills.split(", ")
                                )
                            );
                        }
                        history.push(PagePathEnum.SEARCH);
                        searchWithAppliedFilterAction();
                    }}
                >
                    Search with these skills
                </SkillButton>
            </StyledHeading>
            <StyledSkillContainer>
                {parseSkills(
                    employee.skills,
                    styles,
                    setProfileSkills,
                    searchWithAppliedFilterAction,
                    history
                )}
            </StyledSkillContainer>
        </ContainerDiv>
    );
}

const mapDispatchToProps = (dispatch) => ({
    setProfileSkills: (skills) =>
        dispatch(setProfileSkills(skills)),
    searchWithAppliedFilterAction: () =>
        dispatch(searchWithAppliedFilterAction()),
});

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
        transition: color ease 0.5s, background-color ease 0.5s;
    }
    &&:hover {
        color: #00569c;
    }
`;

const SkillCategoryTd = styled.td`
    text-align: right;
`;

export default connect(null, mapDispatchToProps)(SkillsArea);
