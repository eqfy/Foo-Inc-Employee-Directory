import { defaultFilterState } from "states/filterState";

export default function filterReducer(state = defaultFilterState, action) {
    switch (action.type) {
        case "SET_FILTERS":
            return {
                ...state,
                ...action.payload,
            };
        case "ADD_FILTERS":
            return {
                ...state,
                byId: { ...state.byId, ...action.payload.byId },
                allId: state.allId.concat(action.payload.allId),
                categoryById: {
                    ...mergeIds(
                        state.categoryById,
                        action.payload.categoryById
                    ),
                },
                locationAllId: [...state.location, ...action.payload.location],
                titleAllId: [...state.title, ...action.payload.title],
            };
        default:
            return state;
    }
}

const mergeIds = (orig, other) => {
    for (const [key, value] of Object.entries(other)) {
        if (!orig[key]) {
            orig[key] = value;
        } else {
            orig[key] = orig[key].concat(value);
        }
    }
    return orig;
};
