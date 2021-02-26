import { combineReducers } from "redux";
import simpleReducer from "./simpleReducer";
import filterReducer from "./filterReducer";
import workerReducer from "./workerReducer";
import appStateReducer from "./appStateReducer";
import searchPageReducer from "./searchPageReducer";
import orgChartReducer from "./orgChartReducer";

export default combineReducers({
    simpleReducerResult: simpleReducer,
    filters: filterReducer,
    workers: workerReducer,
    appState: appStateReducer,
    searchPageState: searchPageReducer,
    orgChartState: orgChartReducer,
});
