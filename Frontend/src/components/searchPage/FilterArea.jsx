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
import { coordinatedDebounce } from "./helpers";
import { searchWithAppliedFilterAction } from "actions/searchAction";

const chipColors = {
    location: "#00D1FF",
    title: "#FF9900",
    company: "#A4DA65",
    department: "#A5BDE5",
    skill: "#D877CF",
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
        setFilterAction,
        setWorkerTypeAction,
        setSortKeyAction,
        setSortOrderAction,
        searchWithAppliedFilterAction,
    } = props;
    const classes = useStyles();
    const createChipDataList = (filterState = [], type = "") => {
        return filterState.map((filter) => ({ label: filter, type: type }));
    };
    const createCatagorizedChipDataList = (
        categorizedFilterState,
        type = ""
    ) => {
        return Object.entries(categorizedFilterState).reduce(
            (acc, [category, skills = []]) => {
                skills.forEach((skill) => {
                    acc = acc.concat({
                        label: skill,
                        type: type,
                        category: category,
                    });
                });
                return acc;
            },
            []
        );
    };

    const chipData = [
        ...createChipDataList(locationState, "location"),
        ...createChipDataList(titleState, "title"),
        ...createChipDataList(companyState, "company"),
        ...createChipDataList(departmentState, "department"),
        ...createCatagorizedChipDataList(skillState, "skill"),
    ];

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
        setFilterAction(
            chipToDelete.type,
            chipToDelete.label,
            chipToDelete.category
        );
        coordinatedDebounce(searchWithAppliedFilterAction, {})();
    };

    const createChipLabel = (chipData) =>
        chipData.category && chipData.category.length > 0 ? (
            <>
                {chipData.label}
                <i>{" (" + chipData.category + ")"}</i>
            </>
        ) : (
            chipData.label
        );

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
                {chipData.length > 0 ? (
                    chipData.map((data) => {
                        return (
                            <li key={data.key} className={classes.chipItem}>
                                <Chip
                                    label={createChipLabel(data)}
                                    onDelete={handleDelete(data)}
                                    className={classes.chip}
                                    style={{
                                        background: chipColors[data.type],
                                    }}
                                />
                            </li>
                        );
                    })
                ) : (
                    <div className={classes.emptyText}>
                        {"No filters applied!"}
                    </div>
                )}
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
    searchWithAppliedFilterAction: () =>
        dispatch(searchWithAppliedFilterAction()),
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
    emptyText: {
        display: "flex",
        justifyContent: "center",
        alignSelf: "center",
        width: "100%",
        color: "rgba(0, 0, 0, 0.54)",
    },
}));
