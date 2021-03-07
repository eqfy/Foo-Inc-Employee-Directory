import { connect } from "react-redux";
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

function ApplyFilterWidget(props) {
    const { filterData, filterState, type, dataLabel, isCategorized } = props;
    const filters = filterData[`${type}AllId`];
    console.log(filters);
    console.log(filterState);
    const handleTextChange = () => {
        // TODO For predictive search, we want to set the filterNum to max when we have typed at least 2 letters
        // searchFilterAction();
    };
    const textFieldLabel = `Filter by ${dataLabel}`;
    const formLabel = `Select one or more ${dataLabel}s displayed below`;

    return (
        <div className="filter-form">
            <StyledTextField
                label={textFieldLabel}
                size="small"
                variant="outlined"
                onChange={handleTextChange}
            />
            <StyledFormLabel>{formLabel}</StyledFormLabel>
            <ApplyFilterCheckboxGroup
                filters={filters}
                isCategorized={isCategorized}
            />
        </div>
    );
}

function ApplyFilterCheckboxGroup(props) {
    const { filters, isCategorized } = props;

    const [expandMore, setExpandMore] = React.useState(true);
    const handleExpandMoreClick = () => {
        setExpandMore(!expandMore);
    };

    return (
        <FormGroup>
            <Collapse in={!expandMore} timeout="auto" unmountOnExit>
                {!isCategorized ? (
                    <CheckboxList options={filters} />
                ) : (
                    <CategorizedCheckboxList categorizedOptions={filters} />
                )}
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

function CategorizedCheckboxList(props) {
    let { categories } = props;

    // TODO convert categorizedOptions into the following const and React states

    categories = {
        Accounting: ["Auditing", "Reconciling", "Transaction Processing"],
        Agriculture: ["Fertilizing", "Harvesting", "Soil Preparation"],
        "Empty Category": [],
    };

    const [categoryExpandMore, setCategoryExpandMore] = React.useState({
        Accounting: true,
        Agriculture: true,
        "Empty Category": true,
    });

    const handleCategoryExpandMoreClick = (name) => {
        setCategoryExpandMore({
            ...categoryExpandMore,
            [name]: !categoryExpandMore[name],
        });
    };

    return (
        <List
            dense
            aria-label="filter list"
            className="categorized-filter-list"
        >
            {Object.entries(categoryExpandMore).map(
                ([name, categoryExpandMore]) => (
                    <div>
                        <ListItem
                            button
                            onClick={() => {
                                handleCategoryExpandMoreClick(name);
                            }}
                            className="category"
                        >
                            <ListItemText
                                primary={name}
                                className="category-text category-text category-text"
                            />
                            {!categoryExpandMore ? (
                                <ExpandMore className="expand-icon" />
                            ) : (
                                <ExpandLess className="expand-icon" />
                            )}
                        </ListItem>
                        <Collapse
                            in={categoryExpandMore}
                            timeout="auto"
                            unmountOnExit
                        >
                            <CheckboxList
                                category={name}
                                options={categories[name]}
                            />
                        </Collapse>
                    </div>
                )
            )}
        </List>
    );
}

function CheckboxList(props) {
    const { options, category = "" } = props;

    const [checkboxes, setCheckboxes] = React.useState(
        options.reduce((acc, curr) => {
            acc[curr] = false;
            return acc;
        }, {})
    );

    const handleCheckboxChange = (name, isChecked) => {
        // TODO selectFilterAction()
        // Use category to create more specific payloads

        setCheckboxes({
            ...checkboxes,
            [name]: !isChecked,
        });
    };

    return (
        <List dense aria-label="filter list" className="filter-list">
            {Object.entries(checkboxes).map(([name, isChecked], index) => {
                return (
                    <ListItem
                        button
                        className="filter-list-button"
                        onClick={() => {
                            handleCheckboxChange(name, isChecked);
                        }}
                    >
                        <ListItemIcon className="filter-list-icon">
                            <StyledCheckbox
                                edge="start"
                                checked={isChecked}
                                tabIndex={-1}
                                disableRipple
                                inputProps={{ "aria-labelledby": "" }}
                            />
                        </ListItemIcon>
                        <ListItemText
                            primary={name}
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
            skills = [],
            locations = [],
            titles = [],
            departments = [],
            companies = [],
        },
    } = state;
    return {
        filterData: filters,
        filterState: {
            skills,
            locations,
            titles,
            departments,
            companies,
        },
    };
};

const mapDispatchToProps = () => ({
    // TODO dispatches searchFilterAction
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
