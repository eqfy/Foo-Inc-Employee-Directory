import { AndOrEnum } from "./filterState";

export const PageTabIndexEnum = {
    SEARCH: 0,
    PROFILE: 1,
    ORGCHART: 2,
    NEWCONTRACTOR: 3,
    LOGIN: 4,
};

export const WorkerTypeEnum = {
    ALL: "all",
    EMPLOYEE: "employee",
    CONTRACTOR: "contractor",
};

export const mockCurrentEmployeeNumber = "20004";

export const defaultAppState = {
    isAdmin: false,
    currWorkerId: mockCurrentEmployeeNumber,
    focusedWorkerId: mockCurrentEmployeeNumber,
    ready: true,
    filtersChanged: false,
    skillState: {},
    skillLogic: AndOrEnum.AND,
    locationState: [],
    titleState: [],
    departmentState: [],
    companyState: [],
    firstName: "",
    lastName: "",
    yearsPriorExperience: 0,
    shownWorkerType: WorkerTypeEnum.ALL,
    snackbarState: {
        open: false,
        severity: "success",
        message: "test",
    },
    profileLinkedToSearchResults: false,
};
