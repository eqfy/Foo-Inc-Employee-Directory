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

export const setFilterAction = (filterId, type) => (dispatch, getState) => {
    const { appState } = getState();
    const filterState = appState[`${type}State`];
    const currIndex = filterState.indexOf(filterId);
    if (currIndex === -1) {
        filterState.push(filterId);
    } else {
        filterState.splice(currIndex, 1);
    }
    dispatch({
        type: `SET_${type.toUpperCase()}`,
        payload: filterState,
    });
};

export const setCategorizedFilterAction = (filterId, category, type) => (
    dispatch,
    getState
) => {
    const { appState } = getState();
    const categoryState = appState[`${type}State`];
    const filterState = categoryState[category] || [];
    const currIndex = filterState.indexOf(filterId);
    if (currIndex === -1) {
        filterState.push(filterId);
    } else {
        filterState.splice(currIndex, 1);
    }
    categoryState[category] = filterState;
    dispatch({
        type: `SET_${type.toUpperCase()}`,
        payload: categoryState,
    });
};
