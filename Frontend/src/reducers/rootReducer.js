import { combineReducers } from "redux";
import filterReducer from "./filterReducer";
import workerReducer from "./workerReducer";
import appStateReducer from "./appStateReducer";
import searchPageReducer from "./searchPageReducer";
import orgChartReducer from "./orgChartReducer";

export default combineReducers({
    filters: filterReducer,
    workers: workerReducer,
    appState: appStateReducer,
    searchPageState: searchPageReducer,
    orgChartState: orgChartReducer,
});
