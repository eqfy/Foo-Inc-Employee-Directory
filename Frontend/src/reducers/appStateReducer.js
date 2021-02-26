import { defaultAppState } from "states/appState";

export default function appStateReducer(state = defaultAppState, action) {
    switch (action.type) {
        case "SET_APP_STATE":
            return {
                ...state,
                isAdmin: action.payload.isAdmin,
                currPage: action.payload.currPage,
                currWorkerId: action.payload.currWorkerId,
                focusedWorkerId: action.payload.focusedWorkerId,
                profileShowPrevNext: action.payload.profileShowPrevNext,
            };
        case "SET_ADMIN_PERM":
            return {
                ...state,
                isAdmin: action.payload.isAdmin,
            };
        case "SET_CURR_PAGE":
            return {
                ...state,
                currPage: action.payload.isAdmin,
            };
        case "SET_CURR_WORKERID":
            return {
                ...state,
                currWorkerId: action.payload.isAdmin,
            };
        case "SET_FOCUSED_WORKERID":
            return {
                ...state,
                focusedWorkerId: action.payload.focusedWorkerId,
            };
        case "SET_PROFILE_SHOW_PREV_NEXT":
            return {
                ...state,
                profileShowPrevNext: action.payload.profileShowPrevNext,
            };
        default:
            return state;
    }
}
