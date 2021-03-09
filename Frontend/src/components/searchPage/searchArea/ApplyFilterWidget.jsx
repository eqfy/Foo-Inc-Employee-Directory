import {
    setCategorizedFilterAction,
    setFilterAction,
} from "actions/filterAction";
import { searchWithAppliedFilterAction } from "actions/searchAction";
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

const ApplyFilterTimer = {};

function ApplyFilterWidget(props) {
    const {
        filterData,
        filterState,
        type,
        isCategorized,
        setFilterAction,
        setCategorizedFilterAction,
        searchWithAppliedFilterAction,
    } = props;
    const filters = filterData[`${type}AllId`];
    const appliedFilters = filterState[`${type}State`];
    const handleTextChange = () => {
        // TODO For predictive search
    };

    const handleCheckboxChange = (name, category = "") => {
        if (category.length > 0) {
            setCategorizedFilterAction(name, category, type);
        } else {
            setFilterAction(name, type);
        }
        coordinatedDebounce(searchWithAppliedFilterAction, ApplyFilterTimer)();
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
            />
            <StyledFormLabel>{formLabel}</StyledFormLabel>
            <CollapsableFilterBox>
                {!isCategorized ? (
                    <CheckboxList
                        filters={filters}
                        appliedFilters={appliedFilters}
                        type={type}
                        handleCheckboxChange={handleCheckboxChange}
                    />
                ) : (
                    <CategorizedCheckboxList
                        categorizedFilters={filters}
                        appliedFilters={appliedFilters}
                        type={type}
                        handleCheckboxChange={handleCheckboxChange}
                    />
                )}
            </CollapsableFilterBox>
        </div>
    );
}

function CollapsableFilterBox(props) {
    const { children } = props;

    const [expandMore, setExpandMore] = React.useState(true);
    const handleExpandMoreClick = () => {
        setExpandMore(!expandMore);
    };

    return (
        <FormGroup>
            <Collapse in={!expandMore} timeout="auto" unmountOnExit>
                {children}
            </Collapse>
            <Button
                type="submit"
                className="expand-more expand-icon"
                aria-label="expand less"
                onClick={handleExpandMoreClick}
            >
                {expandMore ? <ExpandMore /> : <ExpandLess />}
            </Button>
        </FormGroup>
    );
}

function CollapsableCategoryBox(props) {
    const { children, label } = props;

    const [expandMore, setExpandMore] = React.useState(true);
    const handleExpandMoreClick = () => {
        setExpandMore(!expandMore);
    };

    return (
        <>
            <ListItem
                button
                className="category"
                onClick={handleExpandMoreClick}
            >
                <ListItemText primary={label} className="category-text" />

                {expandMore ? (
                    <ExpandMore className="expand-icon" />
                ) : (
                    <ExpandLess className="expand-icon" />
                )}
            </ListItem>
            <Collapse in={!expandMore} timeout="auto" unmountOnExit>
                {children}
            </Collapse>
        </>
    );
}

function CategorizedCheckboxList(props) {
    let { categorizedFilters, appliedFilters, handleCheckboxChange } = props;
    return (
        <List
            dense
            aria-label="filter list"
            className="categorized-filter-list"
        >
            {Object.entries(categorizedFilters).map(([category, filters]) => (
                <CollapsableCategoryBox label={category} key={category}>
                    <CheckboxList
                        category={category}
                        filters={filters}
                        appliedFilters={appliedFilters[`${category}`] || []}
                        handleCheckboxChange={handleCheckboxChange}
                    />
                </CollapsableCategoryBox>
            ))}
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
                        key={index}
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
    setFilterAction: (filterId, filterType) =>
        dispatch(setFilterAction(filterId, filterType)),
    setCategorizedFilterAction: (filterId, category, filterType) =>
        dispatch(setCategorizedFilterAction(filterId, category, filterType)),
    searchWithAppliedFilterAction: () =>
        dispatch(searchWithAppliedFilterAction()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ApplyFilterWidget);

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