import { setFilterAction } from "actions/filterAction";
import { searchWithAppliedFilterAction } from "actions/searchAction";
import { SearchWithFilterTimer } from "components/SearchPageContainer";
import { matchSorter } from "match-sorter";
import { connect } from "react-redux";
import { coordinatedDebounce } from "../helpers";
import "./SearchArea.css";
const React = require("react");
const {
    TextField,
    FormLabel,
    FormGroup,
    styled,
    Button,
    List,
    ListItemText,
    ListItem,
    Collapse,
    ListItemIcon,
    Checkbox,
} = require("@material-ui/core");
const { ExpandLess, ExpandMore } = require("@material-ui/icons");

const FilterTextTimer = {};

function ApplyFilterWidget(props) {
    const {
        filterData,
        filterState,
        type,
        isCategorized,
        setFilterAction,
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

    const textFieldLabel = `Filter by ${type}`;
    const formLabel = `Type in a ${type} or select one from below`;

    return (
        <div className="filter-form">
            <StyledTextField
                label={textFieldLabel}
                size="small"
                variant="outlined"
                onChange={handleTextChange}
                onKeyPress={handleTextKeyPress}
            />
            <StyledFormLabel>{formLabel}</StyledFormLabel>
            <CollapsableFilterBox
                expanded={expanded}
                setExpanded={setExpanded}
                setIsPredictive={setIsPredictive}
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
            </CollapsableFilterBox>
        </div>
    );
}

function CollapsableFilterBox(props) {
    const { children, expanded, setExpanded, setIsPredictive } = props;

    const handleExpandMoreClick = () => {
        setExpanded(!expanded);
        setIsPredictive(false);
    };

    return (
        <FormGroup>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                {children}
            </Collapse>
            <Button
                type="submit"
                className="expand-more expand-icon"
                aria-label="expand less"
                onClick={handleExpandMoreClick}
            >
                {!expanded ? <ExpandMore /> : <ExpandLess />}
            </Button>
        </FormGroup>
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
            >
                <ListItemText primary={label} className="category-text" />
                {!expanded ? (
                    <ExpandMore className="expand-icon" />
                ) : (
                    <ExpandLess className="expand-icon" />
                )}
            </ListItem>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
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
                        <ListItemIcon className="filter-list-icon">
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
    };
};

const mapDispatchToProps = (dispatch) => ({
    setFilterAction: (filterType, filterId, category) =>
        dispatch(setFilterAction(filterType, filterId, category)),
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
    if (matchedResult.length > 0 || Object.keys(matchedResult).length > 0) {
        setExpanded(true);
    } else {
        setExpanded(false);
    }
};

const StyledTextField = styled(TextField)({
    alignSelf: "center",
    width: "100%",
    paddingBottom: 4,
});

const StyledFormLabel = styled(FormLabel)({
    marginTop: 6,
    fontSize: 12,
});

const StyledCheckbox = styled(Checkbox)({
    padding: 2,
    paddingLeft: 10,
    color: "#1c83fb !important",
});
