import { defaultOrgChartState } from "states/orgChart";

export default function orgChartReducer(state = defaultOrgChartState, action) {
    switch (action.type) {
        case "SET_ORGCHART":
            return {
                ...state,
                supervisor: action.payload.supervisor,
                peers: action.payload.peers,
                subordinates: action.payload.subordinates,
            };
        default:
            return state;
    }
}
