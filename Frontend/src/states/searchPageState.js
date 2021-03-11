export const SortKeyEnum = {
    NONE: "none",
    NAME: "name",
    TITLE: "title",
};

export const defualtSearchPageState = {
    resultOrder: [],
    pageNumber: 1,
    isAscending: false,
    sortKey: SortKeyEnum.NONE,
};
