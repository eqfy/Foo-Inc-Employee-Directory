export const simpleAction = (context) => (dispatch) => {
    console.log(context);
    dispatch({
        type: "SIMPLE_ACTION",
        payload: "result_of_simple_action",
    });
};
