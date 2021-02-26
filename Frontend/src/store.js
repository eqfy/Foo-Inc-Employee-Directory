import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import defaultRootState from "states/root";
import rootReducer from "./reducers/rootReducer";

export default function configureStore(initialState = defaultRootState) {
    return createStore(rootReducer, initialState, applyMiddleware(thunk));
}
