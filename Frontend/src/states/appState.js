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
    skills: [],
    locations: [],
    titles: [],
    departments: [],
    companies: [],
    yearsPriorExperience: 0,
};
