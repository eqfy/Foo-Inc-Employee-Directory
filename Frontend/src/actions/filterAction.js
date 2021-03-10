import { getAllFilters } from "api/filter";

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
        const currIndex = filterState.indexOf(filterId);
        if (currIndex === -1) {
            filterState.push(filterId);
        } else {
            filterState.splice(currIndex, 1);
        }
        categoryState[category] = filterState;
        payload = categoryState;
    } else {
        const filterState = appState[`${type}State`];
        const currIndex = filterState.indexOf(filterId);
        if (currIndex === -1) {
            filterState.push(filterId);
        } else {
            filterState.splice(currIndex, 1);
        }
        payload = filterState;
    }

    dispatch({
        type: `SET_${type.toUpperCase()}`,
        payload: payload,
    });
};

export const setWorkerTypeAction = (searchForEmployee, searchForContractor) => (
    dispatch
) => {
    dispatch({
        type: "SET_WORKER_TYPE_FILTER",
        payload: {
            searchForEmployee,
            searchForContractor,
        },
    });
};

export const setSortKeyAction = (sortKey) => (dispatch) => {
    dispatch({
        type: "SET_SORT_KEY",
        payload: sortKey,
    });
};

export const setSortOrderAction = (sortOrder) => (dispatch) => {
    dispatch({
        type: "SET_SORT_ORDER",
        payload: sortOrder,
    });
};

export const setExperienceAction = (payload) => (dispatch) => {
    dispatch({
        type: "SET_EXPERIENCE",
        payload: payload,
    });
};
