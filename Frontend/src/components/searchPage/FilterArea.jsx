import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import CustomCheckBox from "../common/CustomCheckbox";
import Dropdown from "../common/Dropdown";
import Chip from "@material-ui/core/Chip";
import { connect } from "react-redux";
import {
    clearNameAction,
    clearAppliedFilters,
    setFilterAction,
    setSortKeyAction,
    setSortOrderAction,
    setWorkerTypeAction,
} from "actions/filterAction";
import { coordinatedDebounce } from "./helpers";
import { searchWithAppliedFilterAction } from "actions/searchAction";
import { SearchWithFilterTimer } from "components/SearchPageContainer";
import { WorkerTypeEnum } from "states/appState";
import { SortKeyEnum } from "states/searchPageState";
import { filterTypeEnum } from "states/filterState";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import Tooltip from "@material-ui/core/Tooltip";
import { HelpButton } from "components/common/HelpButton";

const chipColors = {
    [filterTypeEnum.LOCATION]: "#00D1FF",
    [filterTypeEnum.TITLE]: "#FF9900",
    [filterTypeEnum.COMPANY]: "#A4DA65",
    [filterTypeEnum.DEPARTMENT]: "#A5BDE5",
    [filterTypeEnum.SKILL]: "#D877CF",
    [filterTypeEnum.NAME]: "#FFBE0B",
};

function FilterArea(props) {
    const {
        areaState: { isAscending, sortKey },
        filterState: {
            firstName,
            lastName,
            skillState,
            locationState,
            titleState,
            departmentState,
            companyState,
            shownWorkerType,
        },
        setFilterAction,
        setWorkerTypeAction,
        setSortKeyAction,
        setSortOrderAction,
        searchWithAppliedFilterAction,
        clearNameAction,
        clearAppliedFilters,
    } = props;
    const classes = useStyles();
    const createNameChip = () =>
        firstName && lastName
            ? [
                  {
                      label: `Searched name: ${firstName} ${lastName}`,
                      type: filterTypeEnum.NAME,
                  },
              ]
            : [];
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
        ...createNameChip(),
        ...createChipDataList(locationState, filterTypeEnum.LOCATION),
        ...createChipDataList(titleState, filterTypeEnum.TITLE),
        ...createChipDataList(companyState, filterTypeEnum.COMPANY),
        ...createChipDataList(departmentState, filterTypeEnum.DEPARTMENT),
        ...createCatagorizedChipDataList(skillState, filterTypeEnum.SKILL),
    ];

    const handleWorkerTypeChange = (event) => {
        setWorkerTypeAction(event.target.value);
        coordinatedDebounce(
            searchWithAppliedFilterAction,
            SearchWithFilterTimer
        )();
    };

    const handleSortKeyChange = (event) => {
        setSortKeyAction(event.target.value);
        coordinatedDebounce(
            searchWithAppliedFilterAction,
            SearchWithFilterTimer
        )();
    };

    const handleSortOrderChange = (event) => {
        setSortOrderAction(event.target.checked);
        coordinatedDebounce(
            searchWithAppliedFilterAction,
            SearchWithFilterTimer
        )();
    };

    const handleDelete = (chipToDelete) => () => {
        if (chipToDelete.type === "name") {
            clearNameAction();
        } else {
            setFilterAction(
                chipToDelete.type,
                chipToDelete.label,
                chipToDelete.category
            );
        }
        coordinatedDebounce(
            searchWithAppliedFilterAction,
            SearchWithFilterTimer
        )();
    };

    const handleDeleteAll = () => {
        clearAppliedFilters();
        coordinatedDebounce(
            searchWithAppliedFilterAction,
            SearchWithFilterTimer
        )();
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

    const createChipKey = (chipData) =>
        chipData.category && chipData.category.length > 0
            ? `${chipData.label} (${chipData.category})`
            : chipData.label;

    return (
        <div className={classes.filterArea}>
            <div className={classes.sortingArea}>
                <Dropdown
                    values={Object.values(WorkerTypeEnum)}
                    label="show"
                    currValue={shownWorkerType}
                    handleChange={handleWorkerTypeChange}
                />
                <Dropdown
                    values={Object.values(SortKeyEnum)}
                    label="sort by"
                    currValue={sortKey}
                    handleChange={handleSortKeyChange}
                />
                <CustomCheckBox
                    name="sortAsc"
                    label="Ascending"
                    checked={isAscending}
                    handleChange={handleSortOrderChange}
                />
                <HelpButton className={classes.helpButton}>
                    <li>
                        Filters will be applied according to the following
                        rules:
                    </li>
                    <ol>
                        <li>
                            Filters are grouped by type, all groups have an AND
                            relationship (e.g. if Location and Title type
                            filters are applied, the returned result must
                            satisfy the conditions in both filter type groups)
                        </li>
                        <li>
                            Skill type filters have an AND relationship (e.g. if
                            Planning (Accounting) and Planting (Agriculture) are
                            applied, the returned result must possess both
                            skills)
                        </li>
                        <li>
                            Non-skill type filters have an OR relationship (e.g.
                            if Vancouver and Victoria are both applied, then the
                            returned result can be located in either Vancouver
                            or Victoria)
                        </li>
                    </ol>
                </HelpButton>
            </div>
            <div className={classes.skillsBox}>
                {chipData.length > 0 ? (
                    chipData.map((data) => {
                        return (
                            data && (
                                <li
                                    key={createChipKey(data)}
                                    className={classes.chipItem}
                                >
                                    <Chip
                                        label={createChipLabel(data)}
                                        onDelete={handleDelete(data)}
                                        className={classes.chip}
                                        style={{
                                            background: chipColors[data.type],
                                        }}
                                    />
                                </li>
                            )
                        );
                    })
                ) : (
                    <div className={classes.emptyText}>
                        {"No filters applied!"}
                    </div>
                )}
                {chipData.length > 1 && (
                    <Tooltip
                        title="Clear filters"
                        classes={{
                            tooltip: classes.deleteAllToolTip,
                        }}
                    >
                        <IconButton
                            aria-label="deleteAll"
                            className={classes.deleteAllButton}
                            size="small"
                            onClick={handleDeleteAll}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                )}
            </div>
        </div>
    );
}

const mapStateToProps = (state) => {
    const {
        searchPageState: { isAscending, sortKey },
        appState: {
            firstName = "",
            lastName = "",
            skillState = [],
            locationState = [],
            titleState = [],
            departmentState = [],
            companyState = [],
            shownWorkerType,
        },
    } = state;

    return {
        areaState: {
            isAscending,
            sortKey,
        },
        filterState: {
            firstName,
            lastName,
            skillState,
            locationState,
            titleState,
            departmentState,
            companyState,
            shownWorkerType,
        },
    };
};

const mapDispatchToProps = (dispatch) => ({
    setFilterAction: (filterType, filterId, category) =>
        dispatch(setFilterAction(filterType, filterId, category)),
    setWorkerTypeAction: (workerTypeFilter) =>
        dispatch(setWorkerTypeAction(workerTypeFilter)),
    setSortKeyAction: (sortKey) => dispatch(setSortKeyAction(sortKey)),
    setSortOrderAction: (sortOrder) => dispatch(setSortOrderAction(sortOrder)),
    clearNameAction: () => dispatch(clearNameAction()),
    searchWithAppliedFilterAction: () =>
        dispatch(searchWithAppliedFilterAction()),
    clearAppliedFilters: () => dispatch(clearAppliedFilters()),
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
        alignItems: "center",
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
    deleteAllButton: {
        color: "rgba(0, 0, 0, 0.88)",
        marginLeft: "auto",
    },
    deleteAllToolTip: {
        backgroundColor: "white",
        color: "black",
        fontSize: "14px",
        boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.50)",
    },
    emptyText: {
        display: "flex",
        justifyContent: "center",
        alignSelf: "center",
        width: "100%",
        color: "rgba(0, 0, 0, 0.54)",
    },
    helpButton: {
        marginLeft: "auto",
    },
}));
