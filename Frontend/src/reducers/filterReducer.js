import { defaultFilterState } from "states/filterState";
import { mergeIds } from "./helpers";

export default function filterReducer(state = defaultFilterState, action) {
    switch (action.type) {
        case "LOAD_FILTERS":
            return {
                ...state,
                ...action.payload,
                loaded: true,
            };
        case "ADD_FILTERS": // This can be used if we decide to add the abiity creating new filters
            return {
                ...state,
                byId: { ...state.byId, ...action.payload.byId },
                allId: state.allId.concat(action.payload.allId),
                categoryById: {
                    ...mergeIds(
                        state.categoryById,
                        action.payload.categoryById
                    ),
                },
                locationAllId: [
                    ...state.locationAllId,
                    ...action.payload.locationAllId,
                ],
                titleAllId: [...state.titleAllId, ...action.payload.titleAllId],
                departmentAllId: [
                    ...state.departmentAllId,
                    ...action.payload.departmentAllId,
                ],
                companyAllId: [
                    ...state.companyAllId,
                    ...action.payload.companyAllId,
                ],
            };
        default:
            return state;
    }
}
