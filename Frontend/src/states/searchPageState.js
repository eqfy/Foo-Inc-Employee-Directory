import data from "mocks/mockEmployees.json";

export const SortKeyEnum = {
    NONE: "none",
    NAME: "name",
    TITLE: "title",
};


export const defualtSearchPageState = {
    resultOrder: data.map(e => e.employeeId), // TODO: Change to empty array after backend is hooked up. 
    pageNumber: 1,
    isAscending: false,
    sortKey: SortKeyEnum.NONE,
};
