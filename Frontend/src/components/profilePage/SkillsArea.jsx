import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Chip from "@material-ui/core/Chip";
import "./ProfilePage.css";
import { setProfileSkills } from "actions/profileAction";
import { searchWithAppliedFilterAction } from "actions/searchAction";
import { useHistory } from "react-router";
import { PagePathEnum } from "components/common/constants";

const useStyles = makeStyles({
    skillTitle: {
        color: "#1C83FB",
        fontSize: "18px",
        fontWeight: "bold",
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

const convertSkillsToSkillObject = (skills) => {
    const skillObject = {};

    if (skills === "") {
        return skillObject;
    }

    const skillArray = skills.split("||| ");

    skillArray.forEach((fullSkill) => {
        const [skillCategory, skill] = fullSkill.split(":::");
        if (skillObject[skillCategory]) {
            skillObject[skillCategory].push(skill);
        } else {
            skillObject[skillCategory] = [skill];
        }
    });

    // return sorted skillObject
    return Object.keys(skillObject)
        .sort()
        .reduce((obj, key) => {
            obj[key] = skillObject[key].sort();
            return obj;
        }, {});
};

const parseSkillsToTable = (
    skillObject,
    styles,
    setProfileSkills,
    searchWithAppliedFilterAction,
    history
) => {
    if (Object.keys(skillObject).length === 0) {
        return "No skills";
    }

    const skillEntries = [];

    let categoryCounter = 0;
    for (const skillCategory in skillObject) {
        let skillCounter = 0;
        skillEntries.push(
            <tr key={`skillGroup${categoryCounter++}`} data-cy={`profile-skill-group-${skillCategory}`}>
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
                                data-cy={`profile-skill-chip-${skill}`}
                                onClick={() => {
                                    const skills = {};
                                    skills[skillCategory] = [skill];
                                    setProfileSkills(skills);
                                    searchWithAppliedFilterAction();
                                    history.push(PagePathEnum.SEARCH);
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
    const { employee, setProfileSkills, searchWithAppliedFilterAction } = props;
    const styles = useStyles();
    const history = useHistory();

    const skillObject = convertSkillsToSkillObject(employee.skills);

    return (
        <ContainerDiv>
            <StyledHeading className="heading">
                Skills
                <SkillButton
                    variant="contained"
                    disableElevation
                    onClick={() => {
                        setProfileSkills(skillObject);
                        searchWithAppliedFilterAction();
                        history.push(PagePathEnum.SEARCH);
                    }}
                >
                    Search with these skills
                </SkillButton>
            </StyledHeading>
            <StyledSkillContainer data-cy="profile-skill-content">
                {parseSkillsToTable(
                    skillObject,
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
    setProfileSkills: (skills) => dispatch(setProfileSkills(skills)),
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
