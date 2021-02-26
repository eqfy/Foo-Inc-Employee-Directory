import { getFilterAPI } from "api/filter";

export const setFilters = () => (dispatch) => {
    getFilterAPI()
        .then((response) => {
            console.log(response);
            dispatch({
                type: "SET_FILTER_ACTION",
                payload: response,
            });
        })
        .catch((error) => {
            console.error("Filter endpoint failed.\nErr:", error);
        });
};
