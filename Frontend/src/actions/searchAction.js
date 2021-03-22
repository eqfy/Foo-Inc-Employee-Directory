import { parseFullName } from "parse-full-name";
import { WorkerTypeEnum } from "states/appState";
import { searchWorker, searchWorkerByName } from "../api/search";
import {
    clearAppliedFilters,
    setExperienceAction,
    setFiltersChanged,
    setNameAction,
} from "./filterAction";

export const searchByNameAction = (payload) => (dispatch, getState) => {
    // The first search by name returns a list of possible values for the name
    // If the user then proceeds to click on a name, then we clear all existing filters and
    // do a regular search with name as the only filter
    const parsedName = parseFullName(payload);
    payload = {
        firstName: parsedName.first,
        lastName: parsedName.last,
    };
    // FIXME this no longer reflects the logic written in the above comments
    dispatch(clearAppliedFilters());
    dispatch(setNameAction(payload));

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
            console.log("API Response", response);
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

    const payload = {
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
        companyname: companyState,
        // FIXME firstName and lastName can only be included after the user has done a predictive
        // search by name and selected a name from the dropdown menu
        // firstName: firstName, // need to handle empty string case
        // lastName: lastName,
        shownWorkerType: shownWorkerType,
        // TODO change this so that we actually only get 3 (or potentially more pages of result)
        // offset: (pageNumber - 1) * 6,
        // fetch: 6,
        offset: 0,
        fetch: 100,
        orderBy: sortKey,
        orderDir: isAscending ? "ASC" : "DESC",
    };
    return payload;
};
