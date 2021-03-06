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
    setListViewAction,
} from "actions/filterAction";
import { coordinatedDebounce } from "../common/helpers";
import { searchWithAppliedFilterAction } from "actions/searchAction";
import { SearchWithFilterTimer } from "components/SearchPageContainer";
import { WorkerTypeEnum } from "states/appState";
import { SortKeyEnum } from "states/searchPageState";
import { filterTypeEnum } from "states/filterState";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import Tooltip from "@material-ui/core/Tooltip";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ViewListIcon from "@material-ui/icons/ViewList";
import AppsIcon from "@material-ui/icons/Apps";

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
        areaState: { isAscending, sortKey, isListView },
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
        setListViewAction,
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

    const handleListViewChange = (event, newValue) => {
        setListViewAction(newValue === "list");
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
                    label="Show"
                    currValue={shownWorkerType}
                    handleChange={handleWorkerTypeChange}
                />
                <Dropdown
                    values={Object.values(SortKeyEnum)}
                    label="Sort by"
                    currValue={sortKey}
                    handleChange={handleSortKeyChange}
                />
                <CustomCheckBox
                    name="sortAsc"
                    label="Ascending"
                    cy-test="sort-dir"
                    checked={isAscending}
                    handleChange={handleSortOrderChange}
                />
                <div className={classes.listToggleLegendArea}>
                    <ToggleButtonGroup
                        value={isListView ? "list" : "grid"}
                        exclusive
                        onChange={handleListViewChange}
                        aria-label="list/grid view"
                        classes={{
                            root: classes.listGridViewToggleButtonGroup,
                        }}
                    >
                        <ToggleButton
                            value="grid"
                            aria-label="grid view"
                            classes={{ root: classes.listGridViewToggleButton }}
                        >
                            <AppsIcon />
                        </ToggleButton>
                        <ToggleButton
                            value="list"
                            aria-label="list view"
                            classes={{ root: classes.listGridViewToggleButton }}
                        >
                            <ViewListIcon />
                        </ToggleButton>
                    </ToggleButtonGroup>
                    <div className={classes.legend}>
                        <div className={classes.orangeSquare}></div>Contractor
                    </div>
                </div>
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
                            aria-label="clear-filters"
                            data-cy="clear-filters"
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
        searchPageState: { isAscending, sortKey, isListView },
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
            isListView,
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
    setListViewAction: (isListView) => dispatch(setListViewAction(isListView)),
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
    listToggleLegendArea: {
        display: "flex",
        margin: "auto 0 auto auto",
    },
    legend: {
        display: "flex",
        margin: "auto 15px auto auto",
    },
    orangeSquare: {
        width: 15,
        height: 15,
        backgroundColor: "#FF9900",
        margin: "auto 10px auto 0",
        borderRadius: 3,
    },
    listGridViewToggleButton: {
        width: 40,
        height: 40,
    },
    listGridViewToggleButtonGroup: {
        float: "right",
        marginRight: 30,
    },
}));
