import { getProfileAPI } from "api/profileAPI";

export const setProfile = (workerId) => (dispatch) => {
    dispatch({
        type: "SET_READY",
        payload: {
            ready: false
        }
    });

    getProfileAPI(workerId)
        .then((response) => {
            // if employee id is valid
            if (response !== null) {
                console.log(response[0]);

                dispatch({
                    type: "SET_FOCUSED_WORKERID",
                    payload: {
                    focusedWorkerId: workerId,
                    }
                });
    
                const workerById = {};
                workerById[workerId] = response[0];
                dispatch({
                    type: "ADD_WORKERS",
                    payload: {
                        byId: workerById,
                        allId: [workerId],
                    }
                });
            }

            dispatch({
                type: "SET_READY",
                payload: {
                    ready: true
                }
            });
        })
        .catch((error) => {
            console.error("Profile endpoint failed.\nErr:", error);
        });
};
