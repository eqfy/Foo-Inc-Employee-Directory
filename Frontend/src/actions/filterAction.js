import { getAllFilters } from "api/filter";
import { WorkerTypeEnum } from "states/appState";
import { SortKeyEnum } from "states/searchPageState";

export const loadFiltersAction = () => (dispatch) => {
    getAllFilters()
        .then((response) => {
            dispatch({
                type: "LOAD_FILTERS",
                payload: response,
            });
        })
        .catch((error) => {
            console.error("Filter endpoint failed.\nErr:", error);
        });
};

export const setFilterAction = (type, filterId, category = "") => (
    dispatch,
    getState
) => {
    const { appState } = getState();
    const isCategorized = category.length > 0;
    let payload;

    if (isCategorized) {
        const categoryState = appState[`${type}State`];
        const filterState = categoryState[category] || [];
        categoryState[category] = toggleFilter(filterId, filterState);
        payload = categoryState;
    } else {
        const filterState = appState[`${type}State`];
        payload = toggleFilter(filterId, filterState);
    }

    dispatch({
        type: `SET_${type.toUpperCase()}`,
        payload: payload,
    });
    dispatch(setFiltersChanged(true));
};

export const setWorkerTypeAction = (shownWorkerType = WorkerTypeEnum.ALL) => (
    dispatch
) => {
    dispatch({
        type: "SET_WORKER_TYPE_FILTER",
        payload: shownWorkerType,
    });
    dispatch(setFiltersChanged(true));
};

export const setSortKeyAction = (sortKey = SortKeyEnum.NONE) => (dispatch) => {
    dispatch({
        type: "SET_SORT_KEY",
        payload: sortKey,
    });
    dispatch(setResultLoading(true));
};

export const setSortOrderAction = (sortOrder) => (dispatch) => {
    dispatch({
        type: "SET_SORT_ORDER",
        payload: sortOrder,
    });
    dispatch(setResultLoading(true));
};

export const setExperienceAction = (workerExperience) => (dispatch) => {
    dispatch({
        type: "SET_EXPERIENCE",
        payload: workerExperience,
    });
    dispatch(setFiltersChanged(true));
};

export const setNameAction = (workerName) => (dispatch) => {
    dispatch({
        type: "SET_NAME",
        payload: workerName,
    });
    dispatch(setFiltersChanged(true));
};

export const clearNameAction = () => (dispatch) => {
    dispatch({ type: "SET_NAME", payload: { firstName: "", lastName: "" } });
    dispatch(setFiltersChanged(true));
};

export const clearAppliedFilters = () => (dispatch) => {
    dispatch({
        type: "CLEAR_APPLIED_FILTERS",
    });
    dispatch(setFiltersChanged(true));
};

export const setFiltersChanged = (isChanged) => (dispatch) => {
    dispatch({
        type: "SET_FILTERS_CHANGED",
        payload: isChanged,
    });
};

export const setResultLoading = (isLoading) => (dispatch) => {
    dispatch({
        type: "SET_RESULT_LOADING",
        payload: {
            resultLoading: isLoading,
        },
    });
};

const toggleFilter = (filterId = "", filterState = []) => {
    const currIndex = filterState.indexOf(filterId);
    if (currIndex === -1) {
        filterState.push(filterId);
    } else {
        filterState.splice(currIndex, 1);
    }
    return filterState;
};
