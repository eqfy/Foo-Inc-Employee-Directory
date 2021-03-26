import { getProfileAPI } from "api/profileAPI";
import { setFilterAction } from "./filterAction";
import { searchWithAppliedFilterAction } from "./searchAction";

export const setFocusedWorkerId = (payload) => (dispatch) => {
    dispatch({
        type: "SET_FOCUSED_WORKERID",
        payload: {
            focusedWorkerId: payload,
        },
    });
};

export const configureCurrUser = () => (dispatch, getState) => {
    const currWorkerId = getState().appState.currWorkerId;
    getProfileAPI(currWorkerId)
        .then((response) => {
            if (response) {
                const workerById = {};
                workerById[currWorkerId] = response;
                dispatch({
                    type: "ADD_WORKERS",
                    payload: {
                        byId: workerById,
                        allId: [currWorkerId],
                    },
                });
                // We get the current user's physical location and set it as the only filter
                const physicalLocation = response.physicalLocation;
                dispatch(setFilterAction("location", physicalLocation));
                // Initiate a search with the current user's physical location
                dispatch(searchWithAppliedFilterAction());
            } else {
                Promise.reject("The current logged in worker does not exist.");
            }
        })
        .catch((error) => {
            console.error("Configure current user failed.\nErr:", error);
        });
};
