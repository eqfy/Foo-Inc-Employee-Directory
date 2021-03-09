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
                allId: state.allId.concat(action.payload.allId),
            };
        default:
            return state;
    }
}
