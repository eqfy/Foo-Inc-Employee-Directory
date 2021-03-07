import { searchAPI } from "../api/search";

export const searchAction = (searchProps) => (dispatch) => {
    searchAPI(searchProps)
        .then((response) => {
            console.log(response);
            dispatch({
                type: "ADD_WORKER",
                payload: "employee data that satisfy filter",
            });
        })
        .catch((error) => {
            console.error("Search endpoint failed.\nErr:", error);
        });
};

export const searchByExperienceAction = (payload) => (dispatch, getState) => {
    dispatch(setExperienceAction(payload));
    payload = createSearchPayload(getState());

    console.log(
        "Search By Experience Action dispatched.\nPayload: %o",
        payload
    );

    searchAPI(payload)
        .then((response) => {
            dispatch({
                type: "ADD_WORKER",
                payload: response,
            });
        })
        .catch((error) => {
            console.error(
                "Search endpoint failed (experience filter).\nErr:",
                error
            );
        });
};

export const setExperienceAction = (payload) => (dispatch) => {
    console.log(
        "Search By Experience Action dispatched.\nPayload: %d",
        payload
    );

    dispatch({
        type: "SET_EXPERIENCE",
        payload: payload,
    });
};

const createSearchPayload = (state) => {
    // FIXME this is not complete!  Fix this once search endpoint is merged in.
    const {
        appState: {
            skills,
            locations,
            titles,
            departments,
            companies,
            yearsPriorExperience,
        },
        searchPageState: { pageNumber, sortKey, isAscending },
    } = state;
    return {
        skills,
        locations,
        titles,
        departments,
        companies,
        yearsPriorExperience,
        pageNumber,
        sortKey,
        isAscending,
    };
};
