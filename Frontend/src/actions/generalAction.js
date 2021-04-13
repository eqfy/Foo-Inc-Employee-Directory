import Cookies from "js-cookie";
import { getProfileAPI } from "api/profileAPI";
import { setFilterAction, setResultLoading } from "./filterAction";
import { searchWithAppliedFilterAction } from "./searchAction";

export const setFocusedWorkerId = (payload) => (dispatch) => {
    dispatch({
        type: "SET_FOCUSED_WORKERID",
        payload: {
            focusedWorkerId: payload,
        },
    });
};

export const setAdmin = (isAdmin) => (dispatch) => {
    dispatch({
        type: "SET_ADMIN_PERM",
        payload: {
            isAdmin,
        },
    });
};

export const setSnackbarState = (snackbarState) => (dispatch) => {
    dispatch({
        type: "SET_SNACKBAR_STATE",
        payload: {
            snackbarState,
        },
    });
};

export const setProfileLinkedToSearchResults = (
    profileLinkedToSearchResults
) => (dispatch) => {
    dispatch({
        type: "SET_PROFILE_LINKED_TO_SEARCH_RESULTS",
        payload: {
            profileLinkedToSearchResults,
        },
    });
};

export const configureCurrUser = () => (dispatch, getState) => {
    // Get the current employee number from the cookies, if non exist then default to the one in the redux state
    let currWorkerId = Cookies.get("CurrentEmployeeNumber");
    if (!currWorkerId) {
        currWorkerId = getState().appState.currWorkerId;
    }
    dispatch(setResultLoading(true));
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
