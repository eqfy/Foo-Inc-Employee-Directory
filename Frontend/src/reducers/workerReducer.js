import { defaultWorkerState } from "states/workerState";

export default function workerReducer(state = defaultWorkerState, action) {
    switch (action.type) {
        case "SET_WORKERS":
            return {
                ...state,
                ...action.payload,
            };
        case "ADD_WORKERS":
            return {
                ...state,
                byId: { ...state.byId, ...action.payload.byId },
                allId: mergeList(state.allId, action.payload.allId),
            };
        default:
            return state;
    }
}

const mergeList = (list1, list2) => {
    list1.forEach(ele1 => {
        if (!list2.includes(ele1)) {
            list2.push(ele1);
        }
    });
    return list2;
};