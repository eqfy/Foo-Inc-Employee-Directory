import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CustomCheckBox from "../common/CustomCheckbox";
import Dropdown from "../common/Dropdown";
import Chip from "@material-ui/core/Chip";
import { connect } from "react-redux";
import {
    setFilterAction,
    setSortKeyAction,
    setSortOrderAction,
    setWorkerTypeAction,
} from "actions/filterAction";

const chipColors = {
    location: "",
    title: "",
    company: "",
    department: "",
    skill: "",
};

function FilterArea(props) {
    const {
        areaState: {
            isAscending,
            sortKey,
            searchForEmployee,
            searchForContractor,
        },
        filterState: {
            skillState,
            locationState,
            titleState,
            departmentState,
            companyState,
        },
        setWorkerTypeAction,
        setSortKeyAction,
        setSortOrderAction,
    } = props;
    const classes = useStyles();
    // const [chipData, setChipData] = React.useState([
    //     { key: 0, label: "BC", type: "location" },
    //     { key: 1, label: "Programming", type: "skill" },
    //     { key: 2, label: "Program Management", type: "skill" },
    //     { key: 3, label: "Capital", type: "skill" },
    //     { key: 4, label: "Programming", type: "skill" },
    //     { key: 5, label: "Vancouver", type: "location" },
    //     { key: 6, label: "Water Waste Management", type: "skill" },
    // ]);
    // const [chipData, setChipData] = React.useState([]);
    const chipData = [
        ...locationState,
        ...titleState,
        ...companyState,
        ...departmentState,
        ...Object.entries(skillState).reduce((acc, [category, skills = []]) => {
            skills.forEach((skill) => {
                acc = acc.concat(skill + " (" + category + ")");
            });
            return acc;
        }, []),
    ];
    console.log(chipData);

    const handleWorkerTypeChange = (event) => {
        const targetValue = event.target.value;
        setWorkerTypeAction(
            targetValue === "all" || targetValue === "employees",
            targetValue === "all" || targetValue === "contractors"
        );
    };

    const handleSortKeyChange = (event) => {
        setSortKeyAction(event.target.value);
    };

    const handleSortOrderChange = (event) => {
        setSortOrderAction(event.target.checked);
    };

    const handleDelete = (chipToDelete) => () => {
        // TODO: Update redux store
        // setChipData((chips) =>
        //     chips.filter((chip) => chip.key !== chipToDelete.key)
        // );
    };

    return (
        <div className={classes.filterArea}>
            <div className={classes.sortingArea}>
                <Dropdown
                    values={["all", "employees", "contractors"]}
                    label="show"
                    currValue={getWorkerType(
                        searchForEmployee,
                        searchForContractor
                    )}
                    defaultValue="all"
                    handleChange={handleWorkerTypeChange}
                />
                <Dropdown
                    values={["none", "name", "title"]}
                    label="sort by"
                    currValue={sortKey}
                    defaultValue="none"
                    handleChange={handleSortKeyChange}
                />
                <CustomCheckBox
                    name="sortAsc"
                    label="Ascending"
                    checked={isAscending}
                    handleChange={handleSortOrderChange}
                />
            </div>
            <div className={classes.skillsBox}>
                {chipData.map((data) => {
                    return (
                        <li key={data.key} className={classes.chipItem}>
                            <Chip
                                label={data}
                                onDelete={handleDelete(data)}
                                className={classes.chip}
                                style={{
                                    background:
                                        data.type === "location"
                                            ? "#00D1FF"
                                            : "#FF9900",
                                }}
                            />
                        </li>
                    );
                })}
            </div>
        </div>
    );
}

const getWorkerType = (searchForEmployee, searchForContractor) => {
    return searchForEmployee && !searchForContractor
        ? "employees"
        : !searchForEmployee && searchForContractor
        ? "contractors"
        : "all";
};

const mapStateToProps = (state) => {
    const {
        searchPageState: {
            isAscending,
            sortKey,
            searchForEmployee,
            searchForContractor,
        },
        appState: {
            skillState = [],
            locationState = [],
            titleState = [],
            departmentState = [],
            companyState = [],
        },
    } = state;
    return {
        areaState: {
            isAscending,
            sortKey,
            searchForEmployee,
            searchForContractor,
        },
        filterState: {
            skillState,
            locationState,
            titleState,
            departmentState,
            companyState,
        },
    };
};

const mapDispatchToProps = (dispatch) => ({
    setFilterAction: (filterType, filterId, category) =>
        dispatch(setFilterAction(filterType, filterId, category)),
    setWorkerTypeAction: (searchForEmployee, searchForContractor) =>
        dispatch(setWorkerTypeAction(searchForEmployee, searchForContractor)),
    setSortKeyAction: (sortKey) => dispatch(setSortKeyAction(sortKey)),
    setSortOrderAction: (sortOrder) => dispatch(setSortOrderAction(sortOrder)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FilterArea);

const useStyles = makeStyles(() => ({
    filterArea: {
        maxWidth: "90%",
        marginLeft: "auto",
        marginRight: "auto",
        marginBottom: "30px",
    },
    skillsBox: {
        marginTop: "20px",
        marginBottom: "20px",
        border: "1px solid #8A8989",
        borderRadius: "4px",
        display: "flex",
        minHeight: "42px",
        justifyContent: "left",
        flexWrap: "wrap",
    },
    sortingArea: {
        display: "flex",
        marginTop: 0,
    },
    chipItem: {
        listStyle: "none",
    },
    chip: {
        margin: "5px",
        fontSize: "1rem",
    },
}));
