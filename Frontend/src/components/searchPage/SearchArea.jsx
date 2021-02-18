import {
    Paper,
    IconButton,
    TextField,
    Grid,
    styled,
    FormGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    Checkbox,
} from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import SearchIcon from "@material-ui/icons/Search";
import React from "react";
import { connect } from "react-redux";

import "../common/Common.css";

function SearchArea(props) {
    return (
        <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
            spacing={2}
        >
            <Grid item>
                <SearchByNameBar />
            </Grid>
            <Grid item>
                <ApplyFilterArea />
            </Grid>
        </Grid>
    );
}

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

function ApplyFilterArea(props) {
    return (
        <>
            <h5>Apply filters</h5>
            <Grid
                container
                direction="column"
                justify="center"
                alignItems="center"
                spacing={2}
            >
                <Grid item>
                    <FilterGroup />
                </Grid>
                <Grid item></Grid>
            </Grid>
        </>
    );
}

function FilterGroup(props) {
    // const { textFieldLabel, formLabel, filters } = props;
    // FIXME move these to mocks
    const textFieldLabel = "Location";
    const formLabel = "Select one or more locations displayed below";
    const filters = [
        { name: "Vancouver" },
        { name: "Toronto" },
        { name: "Montreal" },
    ];

    const handleChange = (event) => {};
    const handleExpandFilter = (event) => {};
    const defaultFilterNum = 5;
    let currFilterNum = 5;
    let isExpanded = false;
    return (
        <Paper
            component="form"
            elevation={2}
            style={{ alignItems: "center", justifyContent: "center" }}
        >
            <div></div>
            <TextField label={textFieldLabel} size="small" />
            <FormControl>
                <FormLabel>{formLabel}</FormLabel>
                <FormGroup>
                    {filters.slice(0, currFilterNum).map((filter, index) => {
                        return (
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={false}
                                        onChange={handleChange}
                                        name={filter.name}
                                    />
                                }
                                label={filter.name}
                            />
                        );
                    })}
                    {currFilterNum <= defaultFilterNum ? (
                        isExpanded ? (
                            <IconButton
                                type="submit"
                                className="icon-button"
                                aria-label="expand less"
                            >
                                <ExpandLess />
                            </IconButton>
                        ) : (
                            <IconButton
                                type="submit"
                                className="icon-button"
                                aria-label="expand more"
                            >
                                <ExpandMore />
                            </IconButton>
                        )
                    ) : null}
                </FormGroup>
            </FormControl>
        </Paper>
    );
}

// const StyledTextSearchBar = styled(Paper)({
//     padding: "2px",
//     display: "flex",
//     alignItems: "center",
//     width: 250,
//     color: colors.blueGrey[50],
//     backgroundColor: colors.blueGrey[50],
// });

const StyleTextField = styled(TextField)({
    flex: 1,
    marginLeft: 10,
    width: 183,
});

export default connect()(SearchArea);
