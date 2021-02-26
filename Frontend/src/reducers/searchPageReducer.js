import { defualtSearchPageState } from "states/searchPage";

export default function searchPageReducer(
    state = defualtSearchPageState,
    action
) {
    switch (action.type) {
        case "SET_PAGE_STATE":
            return {
                ...state,
                appliedFilters: action.payload.appliedFilters,
                appliedExperienceFilter: action.payload.appliedExperienceFilter,
                searchPageOrder: action.payload.searchPageOrder,
            };
        case "SET_APPLIED_FILTERS":
            return {
                ...state,
                appliedFilters: action.payload.appliedFilters,
            };
        case "SET_EXPERIENCE_FILTER":
            return {
                ...state,
                appliedExperienceFilter: action.payload.appliedExperienceFilter,
            };
        case "SET_SEARCHPAGE_ORDER":
            return {
                ...state,
                searchPageOrder: action.payload.searchPageOrder,
            };
        default:
            return state;
    }
}
