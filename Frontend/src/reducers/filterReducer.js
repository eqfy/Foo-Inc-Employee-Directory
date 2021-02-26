import { defaultFilterState } from "states/filter";

export default function filterReducer(state = defaultFilterState, action) {
    switch (action.type) {
        case "SET_FILTERS":
            return {
                ...state,
                byId: action.payload.byId,
                allId: action.payload.allId,
            };
        case "ADD_FILTERS":
            return {
                ...state,
                byId: { ...state.byId, ...action.payload.byId },
                allId: state.allId.concat(action.payload.allId),
            };
        default:
            return state;
    }
}
