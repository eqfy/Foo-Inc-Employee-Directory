export const pageEnum = {
    SEARCH: "search",
    PROFILE: "profile",
    ORGCHART: "orgchart",
};

export const WorkerTypeEnum = {
    ALL: "all",
    EMPLOYEE: "employee",
    CONTRACTOR: "contractor",
};

export const defaultAppState = {
    isAdmin: false,
    currPage: pageEnum.SEARCH,
    currWorkerId: "",
    focusedWorkerId: "",
    profileShowPrevNext: false,
    skillState: {},
    locationState: [],
    titleState: [],
    departmentState: [],
    companyState: [],
    yearsPriorExperience: 0,
    shownWorkerType: WorkerTypeEnum.ALL,
};
