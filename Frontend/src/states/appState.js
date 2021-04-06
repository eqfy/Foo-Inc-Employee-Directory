export const PageTabIndexEnum = {
    SEARCH: 0,
    PROFILE: 1,
    ORGCHART: 2,
    NEWCONTRACTOR: 3,
    UPDATE: 4, // TODO Remove this in final release
    LOGIN: 5,
    MYPROFILE: 5,
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
    focusedWorkerId: "000000",
    ready: true,
    filtersChanged: false,
    skillState: {},
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
};
