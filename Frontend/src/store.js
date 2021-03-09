import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import defaultRootState from "states/rootState";
import rootReducer from "./reducers/rootReducer";

// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function configureStore(initialState = defaultRootState) {
    return createStore(
        rootReducer,
        initialState,
        composeEnhancers(applyMiddleware(thunk))
    );
}
