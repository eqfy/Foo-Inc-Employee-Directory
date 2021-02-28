import { searchAPI } from "../api/search";

export const searchAction = (searchProps) => (dispatch) => {
    searchAPI(searchProps)
        .then((response) => {
            console.log(response);
            dispatch({
                type: "SEARCH_OPTION",
                payload: "employee data that satisfy filter",
            });
        })
        .catch((error) => {
            console.error("Search endpoint failed.\nErr:", error);
        });
};
