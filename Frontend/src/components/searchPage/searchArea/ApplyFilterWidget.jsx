import React from "react";
import { setFilterAction, setSkillLogicAction } from "actions/filterAction";
import { searchWithAppliedFilterAction } from "actions/searchAction";
import { SearchWithFilterTimer } from "components/SearchPageContainer";
import { AndOrEnum, filterTypeEnum } from "states/filterState";
import { matchSorter } from "match-sorter";
import { connect } from "react-redux";
import { coordinatedDebounce } from "../../common/helpers";
import "./SearchArea.css";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import TextField from "@material-ui/core/TextField";
import styled from "@material-ui/core/styles/styled";
import List from "@material-ui/core/List";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import Collapse from "@material-ui/core/Collapse";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";

const FilterTextTimer = {};

function ApplyFilterWidget(props) {
    const {
        filterData,
        filterState,
        type,
        isCategorized,
        skillLogic,
        setFilterAction,
        setskillLogicAction,
        searchWithAppliedFilterAction,
    } = props;
    const filters = filterData[`${type}AllId`];
    const appliedFilters = filterState[`${type}State`];
    const [displayedFilters, setDisplayedFilters] = React.useState(filters);
    React.useEffect(() => {
        setDisplayedFilters(filters);
    }, [filters]);
    const [expanded, setExpanded] = React.useState(false);
    const [isPredictive, setIsPredictive] = React.useState(false);

    const handleTextChange = (event) => {
        const userInput = event.target.value;
        setIsPredictive(true);
        coordinatedDebounce(predictiveFilterSearch, FilterTextTimer, 300)(
            filters,
            userInput,
            setDisplayedFilters,
            setExpanded
        );
    };

    const handleTextKeyPress = (event) => {
        if (event.key !== "Enter") {
            return;
        }
        if (Array.isArray(displayedFilters) && displayedFilters.length === 1) {
            handleCheckboxChange(displayedFilters[0]);
        } else {
            const filterEntries = Object.entries(displayedFilters);
            if (filterEntries.length === 1) {
                const filterNames = filterEntries[0][1];
                const filterCategory = filterEntries[0][0];
                if (filterNames.length === 1) {
                    handleCheckboxChange(filterNames[0], filterCategory);
                }
            }
        }
    };

    const handleCheckboxChange = (name, category = "") => {
        setFilterAction(type, name, category);
        coordinatedDebounce(
            searchWithAppliedFilterAction,
            SearchWithFilterTimer
        )();
    };

    const handleExpandMoreClick = () => {
        setExpanded(!expanded);
        setIsPredictive(false);
    };

    const handleAndOrClick = () => {
        if (skillLogic === AndOrEnum.AND) {
            setskillLogicAction(AndOrEnum.OR);
        } else {
            setskillLogicAction(AndOrEnum.AND);
        }
        coordinatedDebounce(
            searchWithAppliedFilterAction,
            SearchWithFilterTimer
        )();
    };

    const textFieldLabel = `Filter by ${type}`;

    return (
        <div className="filter-form">
            <StyledTextField
                label={textFieldLabel}
                size="small"
                variant="outlined"
                onChange={handleTextChange}
                onKeyPress={handleTextKeyPress}
                data-cy={`${type}-input`}
                InputProps={{
                    endAdornment: (
                        <span className="filter-bar-adornment">
                            {type === filterTypeEnum.SKILL && (
                                <Button
                                    className="and-or-btn"
                                    onClick={handleAndOrClick}
                                    data-cy={`${skillLogic}-${type}-filters`}
                                >
                                    {skillLogic}
                                </Button>
                            )}
                            <IconButton
                                type="submit"
                                className="expand-more expand-icon"
                                aria-label="expand more/less"
                                onClick={handleExpandMoreClick}
                                data-cy={`expand-${type}-filters`}
                            >
                                {!expanded ? (
                                    <ExpandMoreIcon />
                                ) : (
                                    <ExpandLessIcon />
                                )}
                            </IconButton>
                        </span>
                    ),
                }}
            />
            <Collapse
                in={expanded}
                timeout="auto"
                unmountOnExit
                style={{ width: "100%" }}
            >
                {!isCategorized ? (
                    <CheckboxList
                        filters={displayedFilters}
                        appliedFilters={appliedFilters}
                        type={type}
                        handleCheckboxChange={handleCheckboxChange}
                    />
                ) : (
                    <CategorizedCheckboxList
                        categorizedFilters={displayedFilters}
                        appliedFilters={appliedFilters}
                        type={type}
                        handleCheckboxChange={handleCheckboxChange}
                        expanded={expanded}
                        isPredictive={isPredictive}
                    />
                )}
            </Collapse>
        </div>
    );
}

function CollapsableCategoryBox(props) {
    const { children, label, parentExpanded, isPredictive } = props;

    const [expanded, setExpanded] = React.useState(
        parentExpanded && isPredictive
    );
    const handleExpandMoreClick = () => {
        setExpanded(!expanded);
    };

    return (
        <>
            <ListItem
                button
                className="category"
                onClick={handleExpandMoreClick}
                data-cy={`category-title-${label}`}
            >
                <ListItemText primary={label} className="category-text" />
                {!expanded ? (
                    <ExpandMoreIcon className="expand-icon" />
                ) : (
                    <ExpandLessIcon className="expand-icon" />
                )}
            </ListItem>
            <Collapse
                in={expanded}
                timeout="auto"
                unmountOnExit
                data-cy={`category-checkboxes-${label}`}
            >
                {children}
            </Collapse>
        </>
    );
}

function CategorizedCheckboxList(props) {
    let {
        categorizedFilters,
        appliedFilters,
        handleCheckboxChange,
        expanded,
        isPredictive,
    } = props;
    return (
        <List
            dense
            aria-label="filter list"
            className="categorized-filter-list"
        >
            {Object.entries(categorizedFilters).map(
                ([category, filters], index) => (
                    <CollapsableCategoryBox
                        label={category}
                        key={category + index}
                        parentExpanded={expanded}
                        isPredictive={isPredictive}
                    >
                        <CheckboxList
                            category={category}
                            filters={filters}
                            appliedFilters={appliedFilters[`${category}`] || []}
                            handleCheckboxChange={handleCheckboxChange}
                        />
                    </CollapsableCategoryBox>
                )
            )}
        </List>
    );
}

function CheckboxList(props) {
    const {
        filters,
        appliedFilters,
        category = "",
        handleCheckboxChange,
    } = props;

    return (
        <List dense aria-label="filter list" className="filter-list">
            {filters.map((filterName, index) => {
                return (
                    <ListItem
                        button
                        className="filter-list-button"
                        onClick={() => {
                            handleCheckboxChange(filterName, category);
                        }}
                        key={filterName + index}
                    >
                        <ListItemIcon
                            className="filter-list-icon"
                            data-cy={`${filterName} checkbox`}
                        >
                            <StyledCheckbox
                                edge="start"
                                checked={appliedFilters.includes(filterName)}
                                tabIndex={-1}
                                disableRipple
                                inputProps={{ "aria-labelledby": "" }}
                            />
                        </ListItemIcon>
                        <ListItemText
                            primary={filterName}
                            className="filter-checkbox-text"
                        />
                    </ListItem>
                );
            })}
        </List>
    );
}

const mapStateToProps = (state) => {
    const {
        filters,
        appState: {
            skillState = [],
            locationState = [],
            titleState = [],
            departmentState = [],
            companyState = [],
            skillLogic,
        },
    } = state;
    return {
        filterData: filters,
        filterState: {
            skillState,
            locationState,
            titleState,
            departmentState,
            companyState,
        },
        skillLogic,
    };
};

const mapDispatchToProps = (dispatch) => ({
    setFilterAction: (filterType, filterId, category) =>
        dispatch(setFilterAction(filterType, filterId, category)),
    setskillLogicAction: (skillLogic) =>
        dispatch(setSkillLogicAction(skillLogic)),
    searchWithAppliedFilterAction: () =>
        dispatch(searchWithAppliedFilterAction()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ApplyFilterWidget);

const predictiveFilterSearch = (
    filters,
    userInput,
    setDisplayedFilters,
    setExpanded
) => {
    // If userInput is empty, set expanded to false and displayedFilters to be all possible filters
    if (!userInput || userInput === "") {
        setExpanded(false);
        setDisplayedFilters(filters);
        return;
    }

    let matchedResult;
    if (Array.isArray(filters)) {
        matchedResult = matchSorter(filters, userInput);
    } else {
        // Formatting of filters to work with matchSorter
        const filterObjects = Object.entries(filters).reduce(
            (acc, [category, filterOptions = []]) => {
                filterOptions.forEach((filterOption) => {
                    acc = acc.concat({
                        category: category,
                        filter: filterOption,
                    });
                });
                return acc;
            },
            []
        );
        const matchedFilterObjects = matchSorter(filterObjects, userInput, {
            keys: ["filter", "category"],
        });
        matchedResult = matchedFilterObjects.reduce(
            (acc, categorizedFilter) => {
                if (!acc[categorizedFilter.category]) {
                    acc[categorizedFilter.category] = [
                        categorizedFilter.filter,
                    ];
                } else {
                    acc[categorizedFilter.category] = acc[
                        categorizedFilter.category
                    ].concat(categorizedFilter.filter);
                }
                return acc;
            },
            {}
        );
    }
    setDisplayedFilters(matchedResult);
    setExpanded(true);
};

const StyledTextField = styled(TextField)({
    alignSelf: "center",
    justifyContent: "center",
    width: "100%",
    minWidth: "192px",
});

const StyledCheckbox = styled(Checkbox)({
    padding: 2,
    paddingLeft: 10,
    color: "#1c83fb !important",
});
