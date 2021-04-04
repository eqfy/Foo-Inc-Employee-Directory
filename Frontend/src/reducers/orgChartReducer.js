import { defaultOrgChartState } from "states/orgChartState";

export default function orgChartReducer(state = defaultOrgChartState, action) {
    switch (action.type) {
        case "SET_ORGCHART":
            return {
                ...action.payload.orgChartState,
            };
        case "RESET_ORGCHART":
            return {};
        default:
            return state;
    }
}
