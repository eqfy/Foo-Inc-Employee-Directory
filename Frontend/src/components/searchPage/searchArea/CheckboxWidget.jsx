import { connect } from "react-redux";

const {
    styled,
    Checkbox,
    FormGroup,
    FormControlLabel,
} = require("@material-ui/core");
const React = require("react");

function SearchCheckboxWidget(props) {
    const { options, checkboxCount, category = "" } = props;

    const [checkboxes, setCheckboxes] = React.useState(
        options.reduce((acc, curr) => {
            acc[curr] = false;
            return acc;
        }, {})
    );

    const handleCheckboxChange = (event) => {
        // TODO selectFilterAction()
        // Use category to create more specific payloads

        setCheckboxes({
            ...checkboxes,
            [event.target.name]: event.target.checked,
        });
    };

    return (
        <FormGroup>
            {Object.entries(checkboxes)
                .slice(0, checkboxCount)
                .map(([name, isChecked], index) => {
                    return (
                        <CustomizedCheckbox
                            name={name}
                            isChecked={isChecked}
                            key={index}
                            handleCheckboxChange={handleCheckboxChange}
                        />
                    );
                })}
        </FormGroup>
    );
}

function CustomizedCheckbox(props) {
    const { name, isChecked, key, handleCheckboxChange } = props;
    return (
        <FormControlLabel
            control={
                <StyledCheckbox // FIXME use Moses' customized checkbox
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                    name={name}
                />
            }
            label={name}
            key={key}
            className="filter-checkboxes"
        />
    );
}

const mapStateToProps = (state) => {
    // TODO get the current filter info from the state
    return {};
};

const mapDispatchToProps = (dispatch) => ({
    // TODO dispatches selectFilterAction
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SearchCheckboxWidget);

const StyledCheckbox = styled(Checkbox)({
    padding: 2,
    color: "#1c83fb !important",
});
