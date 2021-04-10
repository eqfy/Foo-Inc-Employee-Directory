import makeStyles from "@material-ui/core/styles/makeStyles";
import CircularProgress from "@material-ui/core/CircularProgress";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Autocomplete from "@material-ui/lab/Autocomplete";
import AddIcon from "@material-ui/icons/Add";
import {
    clearAppliedFilters,
    clearNameAction,
    setNameAction,
} from "actions/filterAction";
import { setFocusedWorkerId } from "actions/generalAction";
import { searchWithAppliedFilterAction } from "actions/searchAction";
import { getPredictiveSearchAPI } from "api/predictiveSearchAPI";
import { SearchWithFilterTimer } from "components/SearchPageContainer";
import { parseFullName } from "parse-full-name";
import React from "react";
import { connect } from "react-redux";
import { coordinatedDebounce } from "../../common/helpers";
import "./SearchArea.css";

const searchByNameTimer = {};

const useStyles = makeStyles({
    loading: {
        color: "#00569c",
        marginLeft: "auto",
        marginRight: "auto",
    },
});

function SearchByNameBar(props) {
    // The first search by name returns a list of possible name values
    // If the user then proceeds to click on a name, then we clear all existing filters
    // (except workerType, sortKey and sortDirection)
    // and do a regular search with the selected name
    const {
        firstName,
        lastName,
        searchWithAppliedFilterAction,
        setNameAction,
        clearNameAction,
        clearAppliedFilters,
        setFocusedWorkerId,
    } = props;
    const [options, setOptions] = React.useState([]);
    const [inputValue, setInputValue] = React.useState(
        firstName && lastName ? firstName + " " + lastName : ""
    );
    const [loading, setLoading] = React.useState(false);

    const classes = useStyles();

    React.useEffect(() => {
        if (inputValue.length >= 2) {
            coordinatedDebounce((name) => {
                const { first, last } = parseFullName(name);
                setLoading(true);
                getPredictiveSearchAPI(first, last)
                    .then((response) => {
                        const seen = {};
                        const uniqueResponse = response.filter((option) => {
                            if (!seen[option.firstName + option.lastName]) {
                                seen[
                                    option.firstName + option.lastName
                                ] = option;
                                option.count = 1;
                                return true;
                            } else {
                                seen[
                                    option.firstName + option.lastName
                                ].count += 1;
                            }
                            return false;
                        });
                        setOptions(uniqueResponse);
                    })
                    .catch((err) => {
                        console.error("Search by name endpoint failed: ", err);
                        setOptions([]);
                    })
                    .finally(() => {
                        setLoading(false);
                    });
            }, searchByNameTimer)(inputValue);
        } else if (
            inputValue.length === 0 &&
            (firstName !== "" || lastName !== "")
        ) {
            // Only if a search by name happend earlier,
            // set first/last name to empty and initiate a new search
            clearNameAction();
            coordinatedDebounce(
                searchWithAppliedFilterAction,
                SearchWithFilterTimer
            )();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputValue]);

    const handleDropdownOptionClick = (option, state) => () => {
        setInputValue(option.firstName + " " + option.lastName);
        clearAppliedFilters();
        setNameAction({
            firstName: option.firstName,
            lastName: option.lastName,
        });
        setFocusedWorkerId(option.employeeNumber);
        coordinatedDebounce(
            searchWithAppliedFilterAction,
            SearchWithFilterTimer
        )();
    };

    const handleTextfieldChange = (value, reason) => {
        if (reason === "input") {
            setInputValue(value);
        } else if (reason === "clear") {
            setInputValue("");
        }
    };

    return (
        <Autocomplete
            options={loading ? ["loading"] : options}
            getOptionLabel={() => inputValue}
            openOnFocus={true}
            freeSolo={true}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="outlined"
                    label="Search by name"
                    size="small"
                    data-cy="search-by-name"
                />
            )}
            renderOption={(option, state) => {
                if (loading) {
                    return (
                        <div className={"search-dropdown-entry"}>
                            <CircularProgress
                                size={"20px"}
                                classes={{ root: classes.loading }}
                            />
                        </div>
                    );
                } else {
                    return (
                        <div
                            className={"search-dropdown-entry"}
                            onClick={handleDropdownOptionClick(option, state)}
                        >
                            {option.count === 1 ? (
                                <img
                                    src={
                                        option.imageURL ||
                                        "/workerPlaceholder.png"
                                    }
                                    alt={"workerPhoto"}
                                />
                            ) : (
                                <div className="grouped-options">
                                    <span className="grouped-count">
                                        {Math.min(option.count, 3)}
                                    </span>{" "}
                                    {option.count > 3 ? (
                                        <>
                                            <AddIcon className="grouped-count-icon" />
                                            <span className="grouped-count-text text-with-add">
                                                found
                                            </span>
                                        </>
                                    ) : (
                                        <span className="grouped-count-text">
                                            found
                                        </span>
                                    )}
                                </div>
                            )}
                            <Typography noWrap>
                                {`${option.firstName} ${option.lastName}`}
                            </Typography>
                        </div>
                    );
                }
            }}
            inputValue={inputValue}
            onInputChange={(_event, value, reason) => {
                handleTextfieldChange(value, reason);
            }}
        />
    );
}

const mapStateToProps = (state) => {
    const { firstName, lastName } = state.appState;
    return {
        firstName,
        lastName,
    };
};

const mapDispatchToProps = (dispatch) => ({
    setNameAction: (name) => dispatch(setNameAction(name)),
    searchWithAppliedFilterAction: () =>
        dispatch(searchWithAppliedFilterAction()),
    clearNameAction: () => dispatch(clearNameAction()),
    clearAppliedFilters: () => dispatch(clearAppliedFilters()),
    setFocusedWorkerId: (workerId) => dispatch(setFocusedWorkerId(workerId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchByNameBar);
