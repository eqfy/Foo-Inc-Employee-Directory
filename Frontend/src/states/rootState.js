import { defaultAppState } from "./appState";
import { defaultFilterState } from "./filterState";
import { defaultOrgChartState } from "./orgChartState";
import { defualtSearchPageState } from "./searchPageState";
import { defaultWorkerState } from "./workerState";

const defaultRootState = {
    appState: defaultAppState,
    searchPageState: defualtSearchPageState,
    orgChartState: defaultOrgChartState,
    workers: defaultWorkerState,
    filters: defaultFilterState,
};

export default defaultRootState;
