import React from "react";
import EmployeeCard from "../common/EmployeeCard";
import "../common/Common.css";
import { ResultEntryPerPage } from "states/searchPageState";
import Grid from "@material-ui/core/Grid";

const gridHeight = 265;

function ResultsAreaGridView(props) {
    const { pageNumber, resultOrder, byId } = props;

    const emptyDiv = () => {
        return <div style={{ height: gridHeight }}></div>;
    };

    const offset = (pageNumber - 1) * ResultEntryPerPage;
    const employeeList = [];

    const getEmployee = (index) => {
        if (offset + index < resultOrder.length) {
            const employeeId = resultOrder[offset + index];
            const employee = employeeId && byId[employeeId];
            return employee ? (
                <EmployeeCard employee={employee} linkToProfile={true} />
            ) : (
                emptyDiv()
            );
        }
        return emptyDiv();
    };

    for (let i = 0; i < ResultEntryPerPage; i++) {
        const employee = getEmployee(i);
        employeeList.push(
            <Grid item xs={3} key={i}>
                {employee}
            </Grid>
        );
    }

    return employeeList;
}

export default ResultsAreaGridView;
