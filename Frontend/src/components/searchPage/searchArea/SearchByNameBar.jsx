import { Button, Grid, styled, TextField } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import React from "react";
import { connect } from "react-redux";
import "./SearchArea.css";

function SearchByNameBar() {
    const handleTextChange = () => {
        // searchNameAction();
    };

    const handleSearchBtnClick = () => {
        // searchNameAction();
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
    }
});

const mapDispatchToProps = () => ({
    // TODO dispatches searchNameAction
});

export default connect(null, mapDispatchToProps)(SearchByNameBar);
