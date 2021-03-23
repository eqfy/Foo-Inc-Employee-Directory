import { WorkerTypeEnum } from "states/appState";
import { searchWorker } from "../api/search";
import {
    clearAppliedFilters,
    setExperienceAction,
    setFiltersChanged,
} from "./filterAction";

export const searchWithAppliedFilterByNameAction = () => (dispatch) => {
    // The first search by name returns a list of possible values for the name
    // If the user then proceeds to click on a name, then we clear all existing filters and
    // do a regular search with name as the only filter
    dispatch(clearAppliedFilters());
    dispatch(searchWithAppliedFilterAction());
};

export const searchWithAppliedFilterAction = () => (dispatch, getState) => {
    const currState = getState();
    const payload = createSearchPayload(currState);
    console.log(
        "Search With Applied Filters Action dispatched.\nPayload: %o",
        payload
    );
    const {
        appState: { filtersChanged },
        searchPageState: { resultOrder, pageNumber },
    } = currState;
    searchWorker(payload)
        .then((response) => {
            let workersById = {};
            let workersAllId = [];
            let newResultOrder = [];
            if (!filtersChanged) {
                newResultOrder = resultOrder;
            }
            dispatch(setFiltersChanged(false));

            response.data.forEach((worker, index) => {
                workersById[worker.employeeNumber] = worker;
                workersAllId.push(worker.employeeNumber);
                newResultOrder[index] = worker.employeeNumber;
            });
            dispatch({
                type: "ADD_WORKERS",
                payload: {
                    byId: workersById,
                    allId: workersAllId,
                },
            });
            dispatch({
                type: "SET_SEARCH_RESULT_ORDER",
                payload: { resultOrder: newResultOrder },
            });
        })
        .catch((error) => {
            console.error(
                "Search endpoint failed (experience filter).\nErr:",
                error
            );
            // FIXME temporarily set result to empty if an error occured
            dispatch(setFiltersChanged(false));
            dispatch({
                type: "SET_SEARCH_RESULT_ORDER",
                payload: { resultOrder: [] },
            });
        });
};

export const searchByExperienceAction = (payload) => (dispatch, getState) => {
    dispatch(setExperienceAction(payload));
    dispatch(searchWithAppliedFilterAction());
};

export const setPageAction = (payload) => (dispatch) => {
    dispatch({
        type: "SET_SEARCH_PAGE_NUMBER",
        payload: {
            pageNumber: payload,
        },
    });
};

const createSearchPayload = (state) => {
    const {
        appState: {
            skillState = {},
            locationState = [],
            titleState = [],
            departmentState = [],
            companyState = [],
            yearsPriorExperience = 0,
            firstName = "",
            lastName = "",
            shownWorkerType = WorkerTypeEnum.ALL,
        },
        searchPageState: { pageNumber, sortKey, isAscending },
    } = state;

    let payload = {
        skills: Object.entries(skillState).reduce((acc, [category, skills]) => {
            acc = acc.concat(
                ...skills.map((skill) => category + ":::" + skill)
            );
            return acc;
        }, []),
        locationPhysical: locationState,
        title: titleState,
        yearsPriorExperience: yearsPriorExperience,
        division: departmentState,
        companyName: companyState,
        shownWorkerType: shownWorkerType,
        // TODO change this so that we actually only get 3 (or potentially more pages of result)
        // offset: (pageNumber - 1) * 6,
        // fetch: 6,
        offset: 0,
        fetch: 100,
        orderBy: sortKey,
        orderDir: isAscending ? "ASC" : "DESC",
    };
    if (firstName !== "" || lastName !== "") {
        payload = { ...payload, firstName, lastName };
    }
    return payload;
};
