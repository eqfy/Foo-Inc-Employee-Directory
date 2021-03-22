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
        case "SET_READY":
            return {
                ...state,
                ready: action.payload.ready,
            };
        case "SET_SKILL":
            return {
                ...state,
                skillState: action.payload,
            };
        case "SET_LOCATION":
            return {
                ...state,
                locationState: action.payload,
            };
        case "SET_TITLE":
            return {
                ...state,
                titleState: action.payload,
            };
        case "SET_DEPARTMENT":
            return {
                ...state,
                departmentState: action.payload,
            };
        case "SET_COMPANY":
            return {
                ...state,
                companyState: action.payload,
            };
        case "SET_EXPERIENCE":
            return {
                ...state,
                yearsPriorExperience: action.payload,
            };
        case "SET_WORKER_TYPE_FILTER":
            return {
                ...state,
                shownWorkerType: action.payload,
            };
        case "CLEAR_FILTERS":
            return {
                ...state,
                skillState: {},
                locationState: [],
                titleState: [],
                departmentState: [],
                companyState: [],
                yearsPriorExperience: 0,
                shownWorkerType: "all",
            };
        default:
            return state;
    }
}
