import { searchAPI } from "../api/search";

export const searchAction = (searchProps) => (dispatch) => {
    searchAPI(searchProps)
        .then((response) => {
            console.log(response);
            dispatch({
                type: "SIMPLE_ACTION",
                payload: "result_of_simple_action",
            });
        })
        .catch((error) => {
            console.error("Search endpoint failed.\nErr:", error);
        });
};
