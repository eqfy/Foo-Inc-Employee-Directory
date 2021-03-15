export const setFocusedWorkerId = (payload) => (dispatch) => {
	dispatch({
		type: "SET_FOCUSED_WORKERID",
		payload: {
			focusedWorkerId: payload,
		}
	});
}
