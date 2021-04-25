import { getOrgChartAPI } from "api/orgChartAPI";

export const setOrgChart = (workerId) => (dispatch) => {
    dispatch({
        type: "SET_READY",
        payload: {
            ready: false,
        },
    });

    dispatch({
        type: "SET_ORGCHART",
        payload: {
            orgChartState: {},
        },
    });

    getOrgChartAPI(workerId)
        .then((response) => {
            // if employee id is invalid
            if (response.focusedWorker !== null) {
                const workersById = {};
                const workersAllId = [];
                const orgChartState = {};

                if (response.supervisor !== null) {
                    workersById[response.supervisor.employeeNumber] =
                        response.supervisor;
                    orgChartState["supervisor"] =
                        response.supervisor.employeeNumber;
                    workersAllId.push(response.supervisor.employeeNumber);
                } else {
                    orgChartState["supervisor"] = undefined;
                }

                orgChartState["colleagues"] = [];
                response.colleagues.forEach((colleague) => {
                    workersById[colleague.employeeNumber] = colleague;
                    workersAllId.push(colleague.employeeNumber);
                    orgChartState["colleagues"].push(colleague.employeeNumber);
                });

                orgChartState["subordinates"] = [];
                response.subordinates.forEach((subordinate) => {
                    workersById[subordinate.employeeNumber] = subordinate;
                    workersAllId.push(subordinate.employeeNumber);
                    orgChartState["subordinates"].push(
                        subordinate.employeeNumber
                    );
                });

                orgChartState["centerWorkerId"] = workerId;

                dispatch({
                    type: "SET_FOCUSED_WORKERID",
                    payload: {
                        focusedWorkerId: workerId,
                    },
                });

                dispatch({
                    type: "ADD_WORKERS",
                    payload: {
                        byId: workersById,
                        allId: workersAllId,
                    },
                });

                dispatch({
                    type: "SET_ORGCHART",
                    payload: {
                        orgChartState: orgChartState,
                    },
                });
            }
        })
        .catch((error) => {
            console.error("Org chart endpoint failed.\nErr:", error);
        })
        .finally(() => {
            dispatch({
                type: "SET_READY",
                payload: {
                    ready: true,
                },
            });
        });
};
