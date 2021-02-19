import { connect } from "react-redux";
const React = require("react");
const {
    Grid,
    Paper,
    TextField,
    FormControl,
    FormLabel,
    FormGroup,
    FormControlLabel,
    Checkbox,
    IconButton,
} = require("@material-ui/core");
const { ExpandLess, ExpandMore } = require("@material-ui/icons");

function ApplyFilterArea(props) {
    return (
        <>
            <Grid
                container
                direction="column"
                justify="center"
                alignItems="center"
                spacing={1}
            >
                <Grid item>
                    <FilterGroup />
                </Grid>
                <Grid item>
                    <FilterGroup />
                </Grid>
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
    // FIXME moyve these to mocks
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
        <div
            style={{
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <div></div>
            <Paper component="form" elevation={2}>
                <TextField label={textFieldLabel} size="small" />
            </Paper>
            <FormControl>
                <FormLabel style={{ fontSize: 10 }}>{formLabel}</FormLabel>
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
                                size="small"
                                aria-label="expand more"
                            >
                                <ExpandMore />
                            </IconButton>
                        )
                    ) : null}
                </FormGroup>
            </FormControl>
        </div>
    );
}

export default connect()(ApplyFilterArea);
