export const pageEnum = {
    SEARCH: "search",
    PROFILE: "profile",
    ORGCHART: "orgchart",
};

export const defaultAppState = {
    isAdmin: false,
    currPage: pageEnum.SEARCH,
    currWorkerId: "",
    focusedWorkerId: "",
    profileShowPrevNext: false,
    ready: false,
    skillState: {},
    locationState: [],
    titleState: [],
    departmentState: [],
    companyState: [],
    yearsPriorExperience: 0,
};
