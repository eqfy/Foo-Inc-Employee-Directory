import { WorkerTypeEnum } from "states/appState";
import { PagesToFetch, ResultEntryPerPage } from "states/searchPageState";
import { searchWorker } from "../api/search";
import { setExperienceAction, setFiltersChanged } from "./filterAction";

export const searchWithAppliedFilterAction = () => (dispatch, getState) => {
    const currState = getState();
    const {
        appState: { filtersChanged },
        searchPageState: { resultOrder, pageNumber },
    } = currState;

    const pageNumberToSearch = getPageNumberToSearch(pageNumber, resultOrder);
    if (
        !filtersChanged &&
        resultOrder[getPageOffset(pageNumber)] &&
        pageNumberToSearch === pageNumber
    ) {
        return;
    }
    const payload = createSearchPayload(currState, pageNumberToSearch);

    searchWorker(payload)
        .then((response) => {
            let workersById = {};
            let workersAllId = [];
            let newResultOrder = [];
            if (filtersChanged) {
                newResultOrder = Array(response.totalCount);
            } else {
                newResultOrder = resultOrder;
            }

            response.data.forEach((worker, index) => {
                workersById[worker.employeeNumber] = worker;
                workersAllId.push(worker.employeeNumber);
                newResultOrder[index + getPageOffset(pageNumberToSearch)] =
                    worker.employeeNumber;
            });
            dispatch({
                type: "ADD_WORKERS",
                payload: {
                    byId: workersById,
                    allId: workersAllId,
                },
            });
            dispatch({
                type: "SET_SEARCH_RESULT_ORDER",
                payload: { resultOrder: newResultOrder },
            });
            if (filtersChanged) {
                dispatch(setPageAction(1));
            }
        })
        .catch((error) => {
            console.error(
                "Search endpoint failed (experience filter).\nErr:",
                error
            );
            // FIXME Set result to empty, should ideally show an error message
            dispatch({
                type: "SET_SEARCH_RESULT_ORDER",
                payload: { resultOrder: [] },
            });
        })
        .finally(() => {
            dispatch(setFiltersChanged(false));
        });
};

export const searchByExperienceAction = (payload) => (dispatch, getState) => {
    dispatch(setExperienceAction(payload));
    dispatch(searchWithAppliedFilterAction());
};

export const setPageAction = (payload) => (dispatch) => {
    dispatch({
        type: "SET_SEARCH_PAGE_NUMBER",
        payload: {
            pageNumber: payload,
        },
    });
    dispatch(searchWithAppliedFilterAction());
};

const createSearchPayload = (state, pageNumberOverride) => {
    const {
        appState: {
            skillState = {},
            locationState = [],
            titleState = [],
            departmentState = [],
            companyState = [],
            yearsPriorExperience = 0,
            firstName = "",
            lastName = "",
            shownWorkerType = WorkerTypeEnum.ALL,
        },
        searchPageState: { pageNumber, sortKey, isAscending },
    } = state;

    let payload = {
        skills: Object.entries(skillState).reduce((acc, [category, skills]) => {
            acc = acc.concat(
                ...skills.map((skill) => category + ":::" + skill)
            );
            return acc;
        }, []),
        locationPhysical: locationState,
        title: titleState,
        yearsPriorExperience: yearsPriorExperience,
        division: departmentState,
        companyName: companyState,
        shownWorkerType: shownWorkerType,
        offset: getPageOffset(pageNumberOverride || pageNumber),
        fetch: PagesToFetch * ResultEntryPerPage,
        orderBy: sortKey,
        orderDir: isAscending ? "ASC" : "DESC",
    };
    if (firstName !== "" || lastName !== "") {
        payload.firstName = firstName;
        payload.lastName = lastName;
    }
    return payload;
};

const getPageOffset = (pageNumber) => (pageNumber - 1) * ResultEntryPerPage;

const getPageNumberToSearch = (pageNumber = 1, resultOrder = []) => {
    const halfPagesToFetch = Math.floor(PagesToFetch / 2);
    const maxPages = Math.ceil(resultOrder.length / ResultEntryPerPage);
    const prevPage = Math.max(pageNumber - 1, 1);
    const nextPage = Math.min(pageNumber + 1, maxPages);
    const prevPagePresent = resultOrder[getPageOffset(prevPage)];
    const nextPagePresent = resultOrder[getPageOffset(nextPage)];

    // If the prevPage and nextPage don't exist, then fetch the pages around the current pageNumber
    // Right now this should be only used by the first page load or switching to the last page
    // because the user cannot go directly to a page in the middle with the current pagination design
    if (!prevPagePresent && !nextPagePresent) {
        return Math.max(pageNumber - halfPagesToFetch, 1);
    } else if (!prevPagePresent) {
        return Math.max(pageNumber - PagesToFetch, 1);
    } else if (!nextPagePresent) {
        return Math.min(nextPage, maxPages);
    }
    return pageNumber;
};
