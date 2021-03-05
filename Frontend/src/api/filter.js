import { mockFilterState } from "states/filterState";

export async function getFilterAPI() {
    // return API.get("GetFilters", "filter");
    return mockFilterState;
}
