import React from "react";
import EmployeeCard from "../common/EmployeeCard";
import { Pagination } from "@material-ui/lab";
import styled from "styled-components";
import data from "../../mocks/mockEmployees.json";
import "../common/Common.css";

const getEmployee = (index) => {
    if (index < data.length) {
        return <div className="card-col"><EmployeeCard employee={data[index]} /></div>
    }
}

function ResultsArea(props) {
    const [page, setPage] = React.useState(1);
    const handleChange = (event, value) => {
        setPage(value);
    };

    return (
        <>
            <div className="card-grid">
                {getEmployee((page - 1) * 6 + 0)}
                {getEmployee((page - 1) * 6 + 1)}
                {getEmployee((page - 1) * 6 + 2)}
                {/* <div className="card-col"><EmployeeCard employee={data[(page-1)*6+1]}/></div> */}
            </div>
            <div className="card-grid">
                {getEmployee((page - 1) * 6 + 3)}
                {getEmployee((page - 1) * 6 + 4)}
                {getEmployee((page - 1) * 6 + 5)}
            </div>
            <StyledPagination count={Math.max(Math.ceil(data.length / 6), 1)} page={page} onChange={handleChange} />
        </>
    );
}

const StyledPagination = styled(Pagination)`
    > * {
        justify-content: center;
    }
`;

export default ResultsArea;
