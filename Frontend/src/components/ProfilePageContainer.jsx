import React from "react";
import { connect } from "react-redux";
import { useParams } from "react-router";
import { CircularProgress } from "@material-ui/core";
import { PageContainer } from "./common/PageContainer";
import CoreInfoArea from "./profilePage/CoreInfoArea";
import SkillsArea from "./profilePage/SkillsArea";
import PrevNextButtons from "./profilePage/PrevNextButtons";
import SearchButton from "./profilePage/SearchButton";
import styled from "styled-components";
import { setProfile } from "actions/profileAction";
import NotFound from "./NotFound";

export function ProfilePageContainer(props) {
    const { workers, ready, setProfile } = props;
    // const [ invalid, setInvalid ] = React.useState(false);

    // @ts-ignore
    const { workerId } = useParams();

    React.useEffect(() => {
        if (workerId) {
            if (workers.byId[workerId] === undefined) {
                // If URL contains workerId that's not in the workers object, make an API call for it
                setProfile(workerId);
            }
        }
    }, []);

    const worker = workers.byId[workerId];
    console.log(workerId);
    console.log(worker);

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
                    <CircularProgress />
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
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProfilePageContainer);

const StyledDiv = styled.div`
    margin-bottom: 25px;
`;
