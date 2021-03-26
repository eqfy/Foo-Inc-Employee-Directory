export const SortKeyEnum = {
    FIRST_NAME: "firstName",
    LAST_NAME: "lastName",
    TITLE: "title",
};

export const defualtSearchPageState = {
    resultOrder: [],
    pageNumber: 1,
    isAscending: false,
    sortKey: SortKeyEnum.FIRST_NAME,
};
