import React from "react";
import { connect } from "react-redux";
import { useParams } from "react-router";
import CircularProgress from "@material-ui/core/CircularProgress";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { CenteredPageContainer, PageContainer } from "./common/PageContainer";
import CoreInfoArea from "./profilePage/CoreInfoArea";
import SkillsArea from "./profilePage/SkillsArea";
import PrevNextButtons from "./profilePage/PrevNextButtons";
import SearchButton from "./profilePage/SearchButton";
import styled from "styled-components";
import { setProfile } from "actions/profileAction";
import { setFocusedWorkerId } from "actions/generalAction";
import WorkerNotFound from "./common/WorkerNotFound";

const useStyles = makeStyles({
    loading: {
        color: "#00569c",
    },
});
export function ProfilePageContainer(props) {
    const { workers, ready, setProfile, setFocusedWorkerId } = props;
    const classes = useStyles();

    const workerId = useParams()["workerId"];

    React.useEffect(() => {
        if (workerId) {
            if (workers.byId[workerId] === undefined) {
                // If URL contains workerId that's not in the workers object, make an API call for it
                setProfile(workerId);
                return;
            } else {
                // update workerId
                setFocusedWorkerId(workerId);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [workerId]);

    const worker = workers.byId[workerId];

    if (worker !== undefined) {
        // has the page ready
        return (
            <PageContainer>
                <StyledDiv className="flex space-between">
                    <SearchButton />
                    <PrevNextButtons />
                </StyledDiv>
                <div className="flex">
                    <CoreInfoArea employee={worker} />
                    <SkillsArea employee={worker} />
                </div>
            </PageContainer>
        );
    } else {
        if (ready) {
            // ready but no worker: invalid id
            return (
                <CenteredPageContainer>
                    <WorkerNotFound />
                </CenteredPageContainer>
            );
        } else {
            // not ready: loading
            return (
                <CenteredPageContainer>
                    <CircularProgress
                        size={"100px"}
                        classes={{ root: classes.loading }}
                    />
                </CenteredPageContainer>
            );
        }
    }
}

const mapStateToProps = (state) => ({
    workers: state.workers,
    focusedWorkerId: state.appState.focusedWorkerId,
    ready: state.appState.ready,
});

const mapDispatchToProps = (dispatch) => ({
    setProfile: (workerId) => dispatch(setProfile(workerId)),
    setFocusedWorkerId: (workerId) => dispatch(setFocusedWorkerId(workerId)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProfilePageContainer);

const StyledDiv = styled.div`
    margin-bottom: 25px;
`;
