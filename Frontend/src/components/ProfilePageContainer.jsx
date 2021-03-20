import React from "react";
import { connect } from "react-redux";
import { useParams } from "react-router";
import { CircularProgress, makeStyles } from "@material-ui/core";
import { PageContainer } from "./common/PageContainer";
import CoreInfoArea from "./profilePage/CoreInfoArea";
import SkillsArea from "./profilePage/SkillsArea";
import PrevNextButtons from "./profilePage/PrevNextButtons";
import SearchButton from "./profilePage/SearchButton";
import styled from "styled-components";
import { setProfile } from "actions/profileAction";
import NotFound from "./NotFound";
import { setFocusedWorkerId } from "actions/generalAction";

const useStyles = makeStyles({
    loading: {
        color: "#00569c",
    },
});
export function ProfilePageContainer(props) {
    const { workers, ready, setProfile, setFocusedWorkerId } = props;
    const classes = useStyles();

    // @ts-ignore
    const { workerId } = useParams();

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
            return <NotFound />;
        } else {
            // not ready: loading
            return (
                <PageContainer>
                    <LoadingContainer>
                        <CircularProgress 
                            size={"100px"}
                            classes={{ root: classes.loading }}/>
                    </LoadingContainer>
                </PageContainer>
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

const LoadingContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(100vh - 70px);
    margin: 0;
    overflow: hidden;
`;
