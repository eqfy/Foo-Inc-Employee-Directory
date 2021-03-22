import data from "mocks/mockEmployees.json";

export const SortKeyEnum = {
    FIRST_NAME: "firstName",
    LAST_NAME: "lastName",
    TITLE: "title",
};


export const defualtSearchPageState = {
    resultOrder: data.map(e => e["employeeNumber"]), // TODO: Change to empty array after backend is hooked up. 
    pageNumber: 1,
    isAscending: false,
    sortKey: SortKeyEnum.FIRST_NAME,
};
