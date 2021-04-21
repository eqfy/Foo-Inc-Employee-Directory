import { defaultAppState } from "./appState";
import { defaultFilterState } from "./filterState";
import { defaultOrgChartState } from "./orgChartState";
import { defaultSearchPageState } from "./searchPageState";
import { defaultWorkerState } from "./workerState";

const defaultRootState = {
    appState: defaultAppState,
    searchPageState: defaultSearchPageState,
    orgChartState: defaultOrgChartState,
    workers: defaultWorkerState,
    filters: defaultFilterState,
};

export default defaultRootState;
