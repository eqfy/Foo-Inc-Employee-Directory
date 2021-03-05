import { DEFAULT_SEARCH_TIMEOUT } from "components/common/constants";

// Debouces a function that is coordinated by a timer object
// The timer can be any object (typically {}) defined outside of a React component
export const coordinatedDebounce = (
    func,
    timer,
    delay = DEFAULT_SEARCH_TIMEOUT
) => {
    return function () {
        clearTimeout(timer["TimerID"]);
        timer["TimerID"] = setTimeout(func, delay, arguments);
    };
};
