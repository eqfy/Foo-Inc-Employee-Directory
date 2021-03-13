import data from "mocks/mockEmployees.json";

const byIdReducer = (accumulator, employee) => {
    accumulator[employee.employeeId] = employee;
    return accumulator;
};


// TODO: Remove and uncomment the empty default once the backend is hooked up. 
export const defaultWorkerState = {
    byId: data.reduce(byIdReducer, {}),
    allId: data.map(e => e.employeeId),
};

// export const defaultWorkerState = {
//     byId: {},
//     allId: [],
// };
