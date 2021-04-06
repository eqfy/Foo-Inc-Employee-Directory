import { defaultAppState, WorkerTypeEnum } from "states/appState";

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
        case "SET_NAME":
            return {
                ...state,
                firstName: action.payload.firstName,
                lastName: action.payload.lastName,
            };
        case "CLEAR_APPLIED_FILTERS":
            // this resets all filters except orderBy and orderDir
            return {
                ...state,
                skillState: {},
                locationState: [],
                titleState: [],
                departmentState: [],
                companyState: [],
                yearsPriorExperience: 0,
                firstName: "",
                lastName: "",
                shownWorkerType: WorkerTypeEnum.ALL,
            };
        case "SET_FILTERS_CHANGED":
            return {
                ...state,
                filtersChanged: action.payload,
            };
        case "SET_SNACKBAR_STATE":
            return {
                ...state,
                snackbarState: action.payload.snackbarState,
            };
        default:
            return state;
    }
}
