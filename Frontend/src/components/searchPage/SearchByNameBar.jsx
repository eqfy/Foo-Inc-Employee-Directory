import { IconButton, Paper, styled, TextField } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import React from "react";
import { connect } from "react-redux";

function SearchByNameBar(props) {
    return (
        <Paper component="form" elevation={2}>
            <StyleTextField label="Search by name" size="small" />
            <IconButton
                type="submit"
                className="icon-button"
                aria-label="search"
            >
                <SearchIcon />
            </IconButton>
        </Paper>
    );
}

const StyleTextField = styled(TextField)({
    width: 190,
    marginLeft: 20,
});

export default connect()(SearchByNameBar);
