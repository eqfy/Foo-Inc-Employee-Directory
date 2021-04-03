import { defualtSearchPageState } from "states/searchPageState";

export default function searchPageReducer(
    state = defualtSearchPageState,
    action
) {
    switch (action.type) {
        case "SET_SEARCH_STATE":
            return {
                ...state,
                ...action.payload,
            };
        case "SET_SEARCH_RESULT_ORDER":
            return {
                ...state,
                resultOrder: action.payload.resultOrder,
            };
        case "SET_SEARCH_PAGE_NUMBER":
            return {
                ...state,
                pageNumber: action.payload.pageNumber,
            };
        case "SET_SORT_ORDER":
            return {
                ...state,
                isAscending: action.payload,
            };
        case "SET_SORT_KEY":
            return {
                ...state,
                sortKey: action.payload,
            };
        case "SET_RESULT_LOADING":
            return {
                ...state,
                resultLoading: action.payload.resultLoading,
            };
        default:
            return state;
    }
}
