import { getProfileAPI } from "api/profileAPI";
import { clearAppliedFilters, setFiltersChanged } from "./filterAction";

export const setProfile = (workerId) => (dispatch) => {
    dispatch({
        type: "SET_READY",
        payload: {
            ready: false,
        },
    });

    getProfileAPI(workerId)
        .then((response) => {
            // if employee id is valid
            if (response !== null) {
                dispatch({
                    type: "SET_FOCUSED_WORKERID",
                    payload: {
                        focusedWorkerId: workerId,
                    },
                });

                const workerById = {};
                workerById[workerId] = response;
                dispatch({
                    type: "ADD_WORKERS",
                    payload: {
                        byId: workerById,
                        allId: [workerId],
                    },
                });
            }

            dispatch({
                type: "SET_READY",
                payload: {
                    ready: true,
                },
            });
        })
        .catch((error) => {
            console.error("Profile endpoint failed.\nErr:", error);
        });
};

export const setProfileSkills = (skills) => (dispatch) => {
    dispatch(clearAppliedFilters());
    dispatch({
        type: "SET_SKILL",
        payload: skills,
    });
    dispatch(setFiltersChanged(true));
};
