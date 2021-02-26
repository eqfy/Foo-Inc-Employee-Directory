import { defaultAppState } from "./appState";
import { defaultFilterState } from "./filter";
import { defaultOrgChartState } from "./orgChart";
import { defualtSearchPageState } from "./searchPage";
import { defaultWorkerState } from "./worker";

const defaultRootState = {
    appState: defaultAppState,
    searchPageState: defualtSearchPageState,
    orgChartState: defaultOrgChartState,
    worker: defaultWorkerState,
    filters: defaultFilterState,
};

export default defaultRootState;
