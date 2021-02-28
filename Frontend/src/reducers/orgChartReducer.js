import { defaultOrgChartState } from "states/orgChartState";

export default function orgChartReducer(state = defaultOrgChartState, action) {
    switch (action.type) {
        case "SET_ORGCHART":
            return {
                ...state,
                ...action.payload,
            };
        default:
            return state;
    }
}
