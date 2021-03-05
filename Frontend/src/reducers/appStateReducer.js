import { defaultAppState } from "states/appState";

export default function appStateReducer(state = defaultAppState, action) {
    switch (action.type) {
        case "SET_APP_STATE":
            return {
                ...state,
                ...action.payload,
            };
        case "SET_ADMIN_PERM":
            return {
                ...state,
                isAdmin: action.payload.isAdmin,
            };
        case "SET_CURR_PAGE":
            return {
                ...state,
                currPage: action.payload.currPage,
            };
        case "SET_CURR_WORKERID":
            return {
                ...state,
                currWorkerId: action.payload.currWorkerId,
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
        case "SET_SKILLS":
            return {
                ...state,
                skills: action.payload,
            };
        case "SET_LOCATIONS":
            return {
                ...state,
                locations: action.payload,
            };
        case "SET_TITLES":
            return {
                ...state,
                titles: action.payload,
            };
        case "SET_DEPARTMENTS":
            return {
                ...state,
                departments: action.payload,
            };
        case "SET_COMPANIES":
            return {
                ...state,
                companies: action.payload,
            };
        case "SET_EXPERIENCE":
            return {
                ...state,
                yearsPriorExperience: action.payload,
            };
        default:
            return state;
    }
}
