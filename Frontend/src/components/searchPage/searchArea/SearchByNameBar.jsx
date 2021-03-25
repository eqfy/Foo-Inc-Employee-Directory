import { TextField, Typography } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { clearNameAction, setNameAction } from "actions/filterAction";
import {
    searchWithAppliedFilterAction,
    searchWithAppliedFilterByNameAction,
} from "actions/searchAction";
import { getPredictiveSearchAPI } from "api/predictiveSearchAPI";
import { SearchWithFilterTimer } from "components/SearchPageContainer";
import { parseFullName } from "parse-full-name";
import React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router";
import { coordinatedDebounce } from "../helpers";
import "./SearchArea.css";

const searchByNameTimer = {};

function SearchByNameBar(props) {
    const {
        firstName,
        lastName,
        searchWithAppliedFilterAction,
        searchWithAppliedFilterByNameAction,
        setNameAction,
        clearNameAction,
    } = props;
    const [options, setOptions] = React.useState([]);
    const [inputValue, setInputValue] = React.useState(
        firstName + " " + lastName
    );

    React.useEffect(() => {
        if (inputValue.length >= 2) {
            coordinatedDebounce((name) => {
                const { first, last } = parseFullName(name);
                getPredictiveSearchAPI(first, last)
                    .then((response) => {
                        setOptions(response);
                    })
                    .catch((err) => {
                        console.error("Search by name endpoint failed: ", err);
                        setOptions([]);
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

    const handleDropdownOptionClick = (option) => () => {
        setInputValue(option.firstName + " " + option.lastName);
        setNameAction({
            firstName: option.firstName,
            lastName: option.lastName,
        });
        coordinatedDebounce(
            searchWithAppliedFilterByNameAction,
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
            options={options}
            getOptionLabel={() => inputValue}
            openOnFocus={true}
            freeSolo={true}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="outlined"
                    label="Search by name"
                    size="small"
                />
            )}
            renderOption={(option) => (
                <div
                    className={"search-dropdown-entry"}
                    onClick={handleDropdownOptionClick(option)}
                >
                    <img
                        src={option.imageURL || "/workerPlaceholder.png"}
                        alt={"workerPhoto"}
                    />
                    <Typography noWrap>
                        {`${option.firstName} ${option.lastName}`}
                    </Typography>
                </div>
            )}
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
    searchWithAppliedFilterByNameAction: () =>
        dispatch(searchWithAppliedFilterByNameAction()),
    setNameAction: (name) => dispatch(setNameAction(name)),
    searchWithAppliedFilterAction: () =>
        dispatch(searchWithAppliedFilterAction()),
    clearNameAction: () => dispatch(clearNameAction()),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchByNameBar);
