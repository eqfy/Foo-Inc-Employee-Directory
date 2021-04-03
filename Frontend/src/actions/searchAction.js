import { WorkerTypeEnum } from "states/appState";
import { PagesToFetch, ResultEntryPerPage } from "states/searchPageState";
import { searchWorker } from "../api/search";
import { setExperienceAction, setFiltersChanged } from "./filterAction";

export const searchWithAppliedFilterAction = (pageNumberOverride) => (
    dispatch,
    getState
) => {
    const currState = getState();
    const {
        appState: { filtersChanged },
        searchPageState: { resultOrder, pageNumber },
    } = currState;

    const pageNumberToSearch = pageNumberOverride || pageNumber;
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
            dispatch(setResultLoading(false));
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

    dispatch(searchFromPageUpdate());
};

const searchFromPageUpdate = () => (dispatch, getState) => {
    const currState = getState();
    const {
        appState: { filtersChanged },
        searchPageState: { resultOrder, pageNumber },
    } = currState;

    if (filtersChanged) return;
    if (resultOrder[getPageOffset(pageNumber)]) return;
    dispatch(setResultLoading(true));
    dispatch(searchWithAppliedFilterAction());
};

const setResultLoading = (isLoading) => (dispatch) => {
    dispatch({
        type: "SET_RESULT_LOADING",
        payload: {
            resultLoading: isLoading,
        },
    });
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
