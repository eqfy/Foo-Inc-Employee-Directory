import mockOrgChart10005 from "../mocks/mockOrgChart{WorkerID=10005}.json";
import mockOrgChart10105 from "../mocks/mockOrgChart{WorkerID=10105}.json";
import mockOrgChart420 from "../mocks/mockOrgChart{WorkerID=420}.json";

export async function getOrgChartAPI(workerId) {
    // TODO: remove waiting 5s for demo, and dummy mocks
    await wait(1000);
    console.log("Waited 1s");
    if (workerId === '10005') {
        return mockOrgChart10005;
    } else if (workerId === '10105') {
        return mockOrgChart10105;
    } else {
        return mockOrgChart420;
    }
}

function wait(timeout) {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
}