export const SortKeyEnum = {
    FIRST_NAME: "firstName",
    LAST_NAME: "lastName",
    TITLE: "title",
};

export const ResultEntryPerPage = 8;

export const ResultEntryCountListGridRatio = 2;

export const PagesToFetch = 10;

export const defaultSearchPageState = {
    resultOrder: [],
    pageNumber: 1,
    isAscending: true,
    isListView: false,
    sortKey: SortKeyEnum.FIRST_NAME,
    resultLoading: true,
};
