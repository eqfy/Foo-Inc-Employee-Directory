import { IconButton, Paper, styled, TextField } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import React from "react";
import { connect } from "react-redux";

function SearchByNameBar(props) {
    const handleTextChange = (event) => {
        // searchNameAction();
    };

    const handleSearchBtnClick = (event) => {
        // searchNameAction();
    };

    return (
        <Paper component="form" elevation={4} className="search-bar">
            <StyledTextField
                label="Search by name"
                size="small"
                onChange={handleTextChange}
            />
            <IconButton
                className="icon-button"
                aria-label="search"
                onClick={handleSearchBtnClick}
            >
                <Search />
            </IconButton>
        </Paper>
    );
}

const StyledTextField = styled(TextField)({
    width: "100%",
    marginLeft: 20,
});

const mapDispatchToProps = (dispatch) => ({
    // TODO dispatches searchNameAction
});

export default connect(null, mapDispatchToProps)(SearchByNameBar);
