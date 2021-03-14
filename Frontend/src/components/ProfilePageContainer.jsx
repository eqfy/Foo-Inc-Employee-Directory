import React from "react";
import { connect } from "react-redux";
import { useParams } from "react-router";
import { PageContainer } from "./common/PageContainer";
import CoreInfoArea from "./profilePage/CoreInfoArea";
import SkillsArea from "./profilePage/SkillsArea";
import PrevNextButtons from "./profilePage/PrevNextButtons";
import SearchButton from "./profilePage/SearchButton";
import styled from "styled-components";
import { setFocusedWorkerId } from 'actions/generalAction';
import NotFound from './NotFound';

export function ProfilePageContainer(props) {
    const { workers, focusedWorkerId, updateFocusedWorkerId } = props;

    // @ts-ignore
    const { workerId } = useParams();
    let worker;

    if (workerId) {
        worker = workers.byId[workerId];

        if (!worker) {
            // TODO: If URL contains workerId that's not in the workers object, make an API call for it
        }

        // If worker is retrieved, update focusedWorkerId
        if (worker) {
            updateFocusedWorkerId(workerId);
        } else {
            // Worker with the specified id is not in the database 
            return <NotFound />
        }
    } else {
        // If no id is specified in the URL, use the default focusedWorkerId
        worker = workers.byId[focusedWorkerId];
    }

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
}

const mapStateToProps = (state) => ({
    workers: state.workers,
    focusedWorkerId: state.appState.focusedWorkerId,
});

const mapDispatchToProps = (dispatch) => ({
    updateFocusedWorkerId: (id) =>
        dispatch(setFocusedWorkerId(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePageContainer);

const StyledDiv = styled.div`
    margin-bottom: 25px;
`;
