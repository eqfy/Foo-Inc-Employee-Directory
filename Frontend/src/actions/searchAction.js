import { parseFullName } from "parse-full-name";
import { searchWorker, searchWorkerByName } from "../api/search";

export const searchAction = (searchProps) => (dispatch) => {
    searchWorker(searchProps)
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

export const searchByNameAction = (payload) => (dispatch, getState) => {
    // We don't store the name in our redux store, (all name searches are one-time)
    const parsedName = parseFullName(payload);
    payload = {
        firstName: parsedName.first,
        lastName: parsedName.last,
    };
    console.log("Search By Name Action dispatched.\nPayload: %o", payload);
    searchWorkerByName(payload).then((response) => {
        dispatch({
            type: "ADD_WORKER",
            payload: response,
        });
    });
};

export const searchByExperienceAction = (payload) => (dispatch, getState) => {
    dispatch(setExperienceAction(payload));
    payload = createSearchPayload(getState());

    console.log(
        "Search By Experience Action dispatched.\nPayload: %o",
        payload
    );

    searchWorker(payload)
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
