import { defaultOrgChartState } from "states/orgChartState";

export default function orgChartReducer(state = defaultOrgChartState, action) {
    switch (action.type) {
        case "SET_ORGCHART":
            return {
                ...state,
                ...action.payload.orgChartState,
            };
        case "RESET_ORGCHART":
            return {};
        case "SET_ZOOM":
            return {
                ...state,
                ...action.payload,
            };
        case "SET_CENTER":
            return {
                ...state,
                centerX: action.payload.centerX,
                centerY: action.payload.centerY,
            };
        default:
            return state;
    }
}
