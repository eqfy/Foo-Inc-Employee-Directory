import React from "react";
import EmployeeCard from "../common/EmployeeCard";
import { Pagination } from "@material-ui/lab";
import styled from "styled-components";
import data from "../../mocks/mockEmployees.json";
import "../common/Common.css";

const entriesPerPage = 6;

const getEmployee = (index) => {
    if (index < data.length) {
        return (
            <div className="card-grid-col">
                <EmployeeCard employee={data[index]} />
            </div>
        );
    }
};

function ResultsArea(props) {
    const [page, setPage] = React.useState(1);
    const handleChange = (event, value) => {
        setPage(value);
    };

    return (
        <>
            <div className="card-grid">
                {getEmployee((page - 1) * entriesPerPage + 0)}
                {getEmployee((page - 1) * entriesPerPage + 1)}
                {getEmployee((page - 1) * entriesPerPage + 2)}
            </div>
            <div className="card-grid">
                {getEmployee((page - 1) * entriesPerPage + 3)}
                {getEmployee((page - 1) * entriesPerPage + 4)}
                {getEmployee((page - 1) * entriesPerPage + 5)}
            </div>
            {/* TODO: track the page in the URL */}
            <StyledPagination
                count={Math.max(Math.ceil(data.length / 6), 1)}
                page={page}
                onChange={handleChange}
            />
        </>
    );
}

const StyledPagination = styled(Pagination)`
    > * {
        justify-content: center;
    }
`;

export default ResultsArea;
