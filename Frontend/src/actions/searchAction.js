import { parseFullName } from "parse-full-name";
import { searchWorker, searchWorkerByName } from "../api/search";
import { setExperienceAction } from "./filterAction";

export const searchAction = (searchProps) => (dispatch) => {
    searchWorker(searchProps)
        .then((response) => {
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
    searchWorkerByName(payload)
        .then((response) => {
            dispatch({
                type: "ADD_WORKER",
                payload: response,
            });
        })
        .catch((error) => {
            console.error("Search endpoint failed (by name).\nErr:", error);
        });
};

export const searchByExperienceAction = (payload) => (dispatch, getState) => {
    dispatch(setExperienceAction(payload));
    dispatch(searchWithAppliedFilterAction());
};

export const searchWithAppliedFilterAction = () => (dispatch, getState) => {
    const payload = createSearchPayload(getState());
    console.log(
        "Search With Applied Filters Action dispatched.\nPayload: %o",
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

export const setPageAction = (payload) => async (dispatch) => {
    await dispatch({
        type: "SET_SEARCH_PAGE_NUMBER",
        payload: {
            pageNumber: payload,
        },
    });
};

const createSearchPayload = (state) => {
    // FIXME this is not complete!  Fix this once search endpoint is merged in.
    const {
        appState: {
            skillState,
            locationState,
            titleState,
            departmentState,
            companyState,
            yearsPriorExperience,
            shownWorkerType,
        },
        searchPageState: { pageNumber, sortKey, isAscending },
    } = state;
    return {
        skills: skillState,
        locations: locationState,
        titles: titleState,
        departments: departmentState,
        companies: companyState,
        yearsPriorExperience,
        pageNumber,
        sortKey,
        isAscending,
        shownWorkerType,
    };
};
