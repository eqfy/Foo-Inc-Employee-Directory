import { Button, Grid, styled, TextField } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import { searchByNameAction } from "actions/searchAction";
import React from "react";
import { connect } from "react-redux";
import { coordinatedDebounce } from "../helpers";
import "./SearchArea.css";

const SearchByNameTimer = {};

function SearchByNameBar(props) {
    const { searchByNameAction } = props;
    const [name, setName] = React.useState("");
    const handleTextChange = (event) => {
        const enteredName = event.target.value;
        setName(enteredName);
        coordinatedDebounce(searchByNameAction, SearchByNameTimer)(enteredName);
    };

    const handleSearchBtnClick = () => {
        searchByNameAction(name);
    };

    return (
        <Grid container spacing={1} alignItems="flex-start" wrap="nowrap">
            <Grid item className="full-width">
                <TextField
                    label="Search by name"
                    size="small"
                    variant="outlined"
                    className="full-width"
                    onChange={handleTextChange}
                />
            </Grid>
            <Grid item>
                <StyledButton
                    className="icon-button"
                    aria-label="search"
                    onClick={handleSearchBtnClick}
                >
                    <Search />
                </StyledButton>
            </Grid>
        </Grid>
    );
}

const StyledButton = styled(Button)({
    width: "40px",
    minWidth: "40px",
    height: "40px",
    backgroundColor: "#1c83fb",
    color: "white",
    "&:hover": {
        backgroundColor: "#00569C",
    },
});

const mapDispatchToProps = (dispatch) => ({
    searchByNameAction: (name) => dispatch(searchByNameAction(name)),
});

export default connect(null, mapDispatchToProps)(SearchByNameBar);
