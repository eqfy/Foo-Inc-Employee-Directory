import { getFilterAPI } from "api/filter";

export const loadFiltersAction = () => (dispatch) => {
    getFilterAPI()
        .then((response) => {
            console.log(response);
            dispatch({
                type: "LOAD_FILTERS",
                payload: response,
            });
        })
        .catch((error) => {
            console.error("Filter endpoint failed.\nErr:", error);
        });
};
