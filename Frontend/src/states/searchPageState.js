export const SortKeyEnum = {
    FIRST_NAME: "firstName",
    LAST_NAME: "lastName",
    TITLE: "title",
};

export const ResultEntryPerPage = 8;

export const PagesToFetch = 5;

export const defualtSearchPageState = {
    resultOrder: [],
    pageNumber: 1,
    isAscending: true,
    sortKey: SortKeyEnum.FIRST_NAME,
    resultLoading: true,
};
