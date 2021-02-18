export default function simpleReducer(state = {}, action) {
    switch (action.type) {
        case "SIMPLE_ACTION":
            return {
                ...state,
                result: action.payload,
            };
        default:
            return state;
    }
}
