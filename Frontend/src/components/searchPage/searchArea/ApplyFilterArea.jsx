import { connect } from "react-redux";
import "./SearchArea.css";
import data from "../../../mocks/mockFilters.json";
import ExperienceSlider from "./ExperienceSlider";
import SearchCheckboxWidget from "./CheckboxWidget";
const React = require("react");
const {
    Paper,
    TextField,
    FormLabel,
    FormGroup,
    IconButton,
    styled,
    Button,
} = require("@material-ui/core");
const { ExpandLess, ExpandMore } = require("@material-ui/icons");

function ApplyFilterArea() {
    return (
        <div className="apply-filter">
            <div className="heading">Apply filters</div>
            <ExperienceSlider />
            <ApplyFilterWidget
                filters={data.locations}
                dataLabel={"location"}
                isCategorized={false}
            />
            <ApplyFilterWidget
                filters={data.titles}
                dataLabel={"title"}
                isCategorized={false}
            />
            <ApplyFilterWidget
                filters={data.skills}
                dataLabel={"skill"}
                isCategorized={true}
            />
        </div>
    );
}

function ApplyFilterWidget(props) {
    const { filters, dataLabel, isCategorized } = props;
    const handleTextChange = (event) => {
        // TODO For predictive search, we want to set the filterNum to max when we have typed at least 2 letters
        // searchFilterAction();
    };
    const textFieldLabel = `Filter by ${dataLabel}`;
    const formLabel = `Select one or more ${dataLabel}s displayed below`;
    return (
        <div className="filter-form">
            <Paper component="form" elevation={4} className="filter-searchbar">
                <StyledTextField
                    label={textFieldLabel}
                    size="small"
                    onChange={handleTextChange}
                />
            </Paper>
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
    const defaultInteractableCount = 0; // Move to top
    const maxInteractableCount = filters.length;

    const [expandMore, setExpandMore] = React.useState(true);
    const handleExpandMoreClick = () => {
        if (!expandMore) {
            setInteractableCount(defaultInteractableCount);
        } else {
            setInteractableCount(maxInteractableCount);
        }
        setExpandMore(!expandMore);
    };

    // The interactableCount is the filterCount or categoryCount of the child component
    const [interactableCount, setInteractableCount] = React.useState(
        defaultInteractableCount // probably get this from props
    );

    return (
        <FormGroup>
            {isCategorized ? (
                <ApplyFilterCategorizedCheckboxGroup
                    categorizedOptions={filters}
                    categoryCount={interactableCount}
                />
            ) : (
                <SearchCheckboxWidget
                    options={filters}
                    checkboxCount={interactableCount}
                />
            )}
            <IconButton
                type="submit"
                className="expand-more"
                aria-label="expand less"
                onClick={handleExpandMoreClick}
            >
                {expandMore ? <ExpandMore /> : <ExpandLess />}
            </IconButton>
        </FormGroup>
    );
}

function ApplyFilterCategorizedCheckboxGroup(props) {
    const { categoryCount } = props;
    const defaultCheckboxCount = 0;
    const maxCheckboxCount = 10;

    // TODO convert categorizedOptions into the following const and React states

    const categories = {
        Accounting: ["Auditing", "Reconciling", "Transaction Processing"],
        Agriculture: ["Fertilizing", "Harvesting", "Soil Preparation"],
        "Empty Category": [],
    };

    const [categoryExpandMore, setCategoryExpandMore] = React.useState({
        Accounting: true,
        Agriculture: true,
        "Empty Category": true,
    });

    const [checkboxCount, setCheckboxCount] = React.useState({
        Accounting: defaultCheckboxCount,
        Agriculture: defaultCheckboxCount,
        "Empty Category": defaultCheckboxCount,
    });

    const handleCategoryExpandMoreClick = (name) => {
        if (!categoryExpandMore[name]) {
            setCheckboxCount({
                ...checkboxCount,
                [name]: defaultCheckboxCount,
            });
        } else {
            setCheckboxCount({
                ...checkboxCount,
                [name]: maxCheckboxCount,
            });
        }
        setCategoryExpandMore({
            ...categoryExpandMore,
            [name]: !categoryExpandMore[name],
        });
    };

    return (
        <FormGroup>
            {Object.entries(categoryExpandMore)
                .slice(0, categoryCount)
                .map(([name, categoryExpandMore], index) => (
                    <div>
                        <Button
                            variant="text"
                            fullWidth
                            className="category"
                            component="div"
                            key={index}
                            onClick={() => {
                                handleCategoryExpandMoreClick(name);
                            }}
                        >
                            <div className="category-text">{name}</div>
                            {categoryExpandMore ? (
                                <ExpandMore className="category-icon" />
                            ) : (
                                <ExpandLess className="category-icon" />
                            )}
                        </Button>
                        <SearchCheckboxWidget
                            category={name}
                            options={categories[name]}
                            checkboxCount={checkboxCount[name]}
                        />
                    </div>
                ))}
        </FormGroup>
    );
}

const mapStateToProps = () => {
    // TODO get the current filter info from the state
    return {};
};

const mapDispatchToProps = (dispatch) => ({
    // TODO dispatches searchFilterAction
});

export default connect(mapStateToProps, mapDispatchToProps)(ApplyFilterArea);

const StyledTextField = styled(TextField)({
    alignSelf: "center",
    width: "85%",
    paddingBottom: 4,
});

const StyledFormLabel = styled(FormLabel)({
    marginTop: 6,
    fontSize: 12,
});
