import { parseFullName } from "parse-full-name";
import { WorkerTypeEnum } from "states/appState";
import { searchWorker, searchWorkerByName } from "../api/search";
import {
    clearAppliedFilters,
    setExperienceAction,
    setNameAction,
} from "./filterAction";

export const searchByNameAction = (payload) => (dispatch, getState) => {
    // If we do a search by name, we delete all applied filters first and then do a search by name
    // After getting the names, we do another searchWithAppliedFilter once user clicks on a name
    const parsedName = parseFullName(payload);
    payload = {
        firstName: parsedName.first,
        lastName: parsedName.last,
    };
    clearAppliedFilters();
    setNameAction(payload);

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

export const searchByExperienceAction = (payload) => (dispatch, getState) => {
    dispatch(setExperienceAction(payload));
    dispatch(searchWithAppliedFilterAction());
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
    return {
        skills: Object.entries(skillState).map(
            ([category, skill]) => category + ":::" + skill
        ),
        locationPhysical: locationState,
        title: titleState,
        yearsPriorExperience: yearsPriorExperience,
        division: departmentState,
        companyname: companyState,
        firstName: firstName,
        lastName: lastName,
        employmentType: {},
        isContractor:
            shownWorkerType === WorkerTypeEnum.ALL ||
            shownWorkerType === WorkerTypeEnum.CONTRACTOR,
        offset: pageNumber * 6,
        fetch: 6,
        orderBy: sortKey,
        orderDir: isAscending ? "ASC" : "DESC",
    };
};
