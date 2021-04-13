import React from "react";
import { PageContainer } from "./common/PageContainer";
import {
    TextField,
    Button,
    Typography,
    CircularProgress,
} from "@material-ui/core";
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { makeStyles } from "@material-ui/core/styles";
import {
    insertContractorAPI,
    getOfficeLocations,
    getGroups,
} from "../api/contractor";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Redirect, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import MuiPhoneNumber from "material-ui-phone-number";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import MenuItem from "@material-ui/core/MenuItem";
import { getPredictiveSearchAPI } from "../../src/api/predictiveSearchAPI";
import { parseFullName } from "parse-full-name";
import { PagePathEnum } from "./common/constants";
import { Storage } from "aws-amplify";
import config from "../config";
import { coordinatedDebounce } from "./common/helpers";

function AddContractor(props) {
    const { filterData, isAdmin } = props;

    const classes = useStyles();
    const { companyAllId, locationAllId, skillAllId } = filterData;

    let skillsByCategory = [];
    for (const category in skillAllId) {
        for (const skill of skillAllId[category]) {
            skillsByCategory.push({ category, skill });
        }
    }

    const defaultState = {
        selectedHireDate: new Date(),
        fieldsStatusIsValid: {},
        errors: {},
        workPhone: "",
        workCell: "",
        snackBar: {},
        profilePic: {},
        supervisor: {},
        selectedCompanyCode: {},
        groupCodesField: {},
        officeCodesField: {},
        loadingState: {},
        selectedSkills: [],
    };
    const [formState, setFormState] = React.useState(defaultState);
    // counter for timeout in case of supervisor input change
    const predictiveSearchTimer = {};

    React.useEffect(() => {
        if (
            formState.supervisor["input"] &&
            formState.supervisor["input"].length >= 2
        ) {
            coordinatedDebounce((name) => {
                const { first, last } = parseFullName(name);
                let supervisor = formState.supervisor;
                updateLoadingState("supervisor", true);
                getPredictiveSearchAPI(first, last)
                    .then((response) => {
                        supervisor["allSupervisors"] = response;
                        setFormState({
                            ...formState,
                            supervisor,
                        });
                    })
                    .catch((err) => {
                        console.error(
                            "Add Contractor Supervisor predictive search failed: ",
                            err
                        );
                    })
                    .finally(() => {
                        updateLoadingState("supervisor", false);
                    });
            }, predictiveSearchTimer)(
                formState.supervisor["input"]
                    ? formState.supervisor["input"]
                    : ""
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formState.supervisor["input"] ? formState.supervisor["input"] : ""]);

    if (!isAdmin) {
        return <Redirect to={`${PagePathEnum.LOGIN}?referrer=addContractor`} />;
    }

    const handleSupervisorTextfieldChange = (value, reason) => {
        let supervisor = formState.supervisor;
        if (reason === "input") {
            supervisor["input"] = value;
            setFormState({
                ...formState,
                supervisor,
            });
        } else if (reason === "clear") {
            supervisor["input"] = "";
            setFormState({
                ...formState,
                supervisor,
            });
        }
    };

    async function handleCompanyTextFieldChange(event, values) {
        // get office locations
        let selectedCompanyCode = formState.selectedCompanyCode;
        let officeCodesField = formState.officeCodesField;
        let groupCodesField = formState.groupCodesField;
        officeCodesField["isVisible"] = false;
        officeCodesField["options"] = [];
        groupCodesField["isVisible"] = false;
        groupCodesField["options"] = [];
        selectedCompanyCode["value"] = values;
        updateLoadingState("officeCode", true);
        setFormState({
            ...formState,
            selectedCompanyCode,
            officeCodesField,
            groupCodesField,
        });
        await getOfficeLocations(values)
            .then((response) => {
                officeCodesField["isVisible"] = true;
                officeCodesField["options"] = response;
                setFormState({
                    ...formState,
                    officeCodesField,
                });
            })
            .catch((err) => {
                // handle errors
                console.error(err);
            })
            .finally(() => {
                updateLoadingState("officeCode", false);
            });
    }

    async function handleOfficeTextFieldChange(event, values) {
        // get group codes
        let groupCodesField = formState.groupCodesField;
        groupCodesField["isVisible"] = false;
        groupCodesField["options"] = [];
        updateLoadingState("groupCode", true);
        setFormState({
            ...formState,
            groupCodesField,
        });

        let requestPayload = {
            companyName: formState.selectedCompanyCode["value"],
            officeName: values,
        };
        await getGroups(requestPayload)
            .then((response) => {
                // handle response array
                groupCodesField["isVisible"] = true;
                groupCodesField["options"] = response;
                setFormState({
                    ...formState,
                    groupCodesField,
                });
            })
            .catch((err) => {
                // handle errors
                console.error(err);
            })
            .finally(() => {
                updateLoadingState("groupCode", false);
            });
    }

    function Alert(props) {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
    }

    function showSnackbar(severity, message) {
        let snackBar = formState.snackBar;
        snackBar["severity"] = severity;
        snackBar["isOpen"] = true;
        snackBar["message"] = message;
        setFormState({
            ...formState,
            snackBar,
        });
    }

    function updateLoadingState(type, isLoading) {
        let loadingState = formState.loadingState;
        loadingState[type] = isLoading;
        setFormState({
            ...formState,
            loadingState,
        });
    }
    const handleSnackbarClose = (event, reason) => {
        let snackBar = formState.snackBar;
        snackBar["isOpen"] = false;
        setFormState({
            ...formState,
            snackBar,
        });
    };

    const validateFormField = (event) => {
        const fieldName = event.target.name;
        const fieldValue = event.target.value;

        let fieldsStatusIsValid = formState.fieldsStatusIsValid;
        let errors = formState.errors;

        const verifyField = (errorMsg = "") => {
            fieldsStatusIsValid[fieldName] = regexHelper(fieldValue, fieldName);
            errors[fieldName] = errorMsg;
            setFormState({
                ...formState,
                fieldsStatusIsValid,
                errors,
            });
        };

        switch (fieldName) {
            case "firstName":
                verifyField("Invalid first name");
                break;
            case "lastName":
                verifyField("Invalid last name");
                break;
            case "email":
                verifyField("Incorrect email format");
                break;
            default: {
            }
        }
    };

    function regexHelper(fieldValue, fieldName) {
        if (fieldName === "firstName" && fieldValue.length > 0) {
            return fieldValue.trim() !== "";
        }
        if (fieldName === "lastName" && fieldValue.length > 0) {
            return fieldValue.trim() !== "";
        }
        if (fieldName === "email" && fieldValue !== "")
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fieldValue);
        return true;
    }

    const handleHireDateChange = (selectedHireDate) => {
        setFormState({
            ...formState,
            selectedHireDate,
        });
    };

    async function uploadProfilePicture() {
        if (!formState.profilePic["file"]) return;

        let url = `https://${config.s3.BUCKET}.s3.amazonaws.com/public/`;
        let profilePic = formState.profilePic;
        await Storage.put(
            formState.profilePic["file"].name,
            formState.profilePic["file"]
        )
            .then((result) => {
                // store the url in local state
                url += result["key"];
                profilePic["url"] = url;
                setFormState({
                    ...formState,
                    profilePic,
                });
            })
            .catch((err) => {
                console.error(err);
                showSnackbar("error", "Image upload failed");
            });
    }

    const saveProfilePicture = (e) => {
        let file = e.target.files[0];
        if (!file) return;
        let fileExt = file.name.substring(file.name.lastIndexOf(".") + 1);
        let fileNameWithoutExt = file.name.replace(`.${fileExt}`, "");
        let newFileName = (
            fileNameWithoutExt +
            "_" +
            new Date().getTime() +
            "." +
            fileExt
        ).toLowerCase();

        let profilePic = formState.profilePic;
        profilePic["file"] = new File([e.target.files[0]], newFileName);
        profilePic["name"] = file.name;
        setFormState({
            ...formState,
            profilePic,
        });
    };

    function fieldErrorHelper(fieldName) {
        return formState.fieldsStatusIsValid[fieldName] === undefined
            ? false
            : !formState.fieldsStatusIsValid[fieldName];
    }

    function fieldHelperText(fieldName) {
        return !formState.fieldsStatusIsValid[fieldName]
            ? formState.errors[fieldName]
            : "";
    }
    async function handleSubmit(event) {
        event.preventDefault();

        let skills = "";
        for (const selectedSkill of formState.selectedSkills) {
            skills +=
                selectedSkill.category + ":::" + selectedSkill.skill + "|||";
        }
        skills = skills.slice(0, -3);

        if (!event.target.groupCode || !event.target.officeCode) {
            showSnackbar(
                "error",
                "Operation failed. Missing office location or group."
            );
            return;
        }

        // validate email field
        if (!regexHelper(event.target.firstName.value, "firstName")) {
            showSnackbar("error", "Operation failed. First name is invalid.");
            return;
        }
        if (!regexHelper(event.target.lastName.value, "lastName")) {
            showSnackbar("error", "Operation failed. Last name is invalid.");
            return;
        }
        if (!regexHelper(event.target.email.value, "email")) {
            showSnackbar("error", "Operation failed. Email field is invalid.");
            return;
        }

        updateLoadingState("submit", true);
        // Upload profile pic
        await uploadProfilePicture();

        const details = {
            FirstName: event.target.firstName.value.trim(),
            LastName: event.target.lastName.value.trim(),
            Email: event.target.email.value,
            WorkPhone: event.target.workPhone.value,
            WorkCell:
                event.target.workCell.value === "+1"
                    ? ""
                    : event.target.workCell.value,
            Title: event.target.title.value,
            SupervisorEmployeeNumber: formState.supervisor["employeeNumber"],
            HireDate: event.target.hireDate.value,
            TerminationDate: null,
            PhysicalLocation: event.target.physicalLocation.value,
            GroupCode: event.target.groupCode.value,
            CompanyCode: event.target.companyCode.value,
            OfficeCode: event.target.officeCode.value,
            skills: skills,
            YearsPriorExperience: event.target.YPE.value,
            PhotoUrl: formState.profilePic["url"]
                ? formState.profilePic["url"]
                : "",
            EmploymentType: event.target.employmentType.value,
        };
        // Submit form to backend
        await insertContractorAPI(details)
            .then((response) => {
                // update snackbar success
                showSnackbar("success", "Contractor added successfully");
            })
            .catch((err) => {
                console.error(err);
                // update snackbar failed
                showSnackbar(
                    "error",
                    "Could not add Contractor. Please ensure a contractor with email provided does not exist in directory"
                );
            })
            .finally(() => {
                updateLoadingState("submit", false);
            });
    }

    return (
        <PageContainer className={classes.root}>
            <form onSubmit={handleSubmit}>
                <h3>
                    <u>Basic information</u>
                </h3>
                <TextField
                    className={classes.textField}
                    label="First Name"
                    placeholder="John"
                    name="firstName"
                    variant="outlined"
                    size="small"
                    required
                    onChange={validateFormField}
                    error={fieldErrorHelper("firstName")}
                    helperText={fieldHelperText("firstName")}
                />

                <TextField
                    className={classes.textField}
                    label="Last Name"
                    placeholder="Doe"
                    name="lastName"
                    variant="outlined"
                    size="small"
                    required
                    onChange={validateFormField}
                    error={fieldErrorHelper("lastName")}
                    helperText={fieldHelperText("lastName")}
                />
                <br></br>
                <TextField
                    className={classes.textField}
                    label="Email"
                    placeholder="john.doe@ae.com"
                    name="email"
                    variant="outlined"
                    size="small"
                    required
                    onChange={validateFormField}
                    error={fieldErrorHelper("email")}
                    helperText={fieldHelperText("email")}
                />
                <MuiPhoneNumber
                    defaultCountry={"ca"}
                    label="Work Phone"
                    name="workPhone"
                    variant="outlined"
                    size="small"
                    required
                    className={classes.textField}
                />
                <br></br>
                <MuiPhoneNumber
                    defaultCountry={"ca"}
                    label="Cell Phone"
                    name="workCell"
                    variant="outlined"
                    size="small"
                    className={classes.textField}
                />
                <input
                    accept="image/*"
                    className={classes.input}
                    id="contained-button-file"
                    multiple
                    type="file"
                    onChange={saveProfilePicture}
                />
                <label htmlFor="contained-button-file">
                    <Button
                        variant="outlined"
                        component="span"
                        startIcon={<AccountBoxIcon />}
                        className={classes.button}
                    >
                        {formState.profilePic["name"] === undefined
                            ? "Upload Profile Image"
                            : formState.profilePic["name"]}
                    </Button>
                </label>
                <h3>
                    <u>Position Details</u>
                </h3>
                <TextField
                    label="Title"
                    placeholder="Contractor"
                    name="title"
                    variant="outlined"
                    size="small"
                    required
                    onChange={validateFormField}
                    error={fieldErrorHelper("title")}
                    helperText={fieldHelperText("title")}
                    className={classes.textField}
                />
                <Autocomplete
                    options={
                        formState.supervisor["allSupervisors"]
                            ? formState.supervisor["allSupervisors"]
                            : formState.loadingState["supervisor"]
                            ? ["loading"]
                            : []
                    }
                    getOptionLabel={() =>
                        formState.supervisor["input"]
                            ? formState.supervisor["input"]
                            : ""
                    }
                    getOptionSelected={(option, value) =>
                        option.employeeNumber === value.employeeNumber
                    }
                    className={classes.textField}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            placeholder="James Smith"
                            variant="outlined"
                            label="Supervisor"
                            size="small"
                            required
                        />
                    )}
                    renderOption={(option) =>
                        formState.loadingState["supervisor"] ? (
                            <div className={"search-dropdown-entry"}>
                                <CircularProgress
                                    size={"20px"}
                                    classes={{ root: classes.loading }}
                                />
                            </div>
                        ) : (
                            <div
                                className={"search-dropdown-entry"}
                                onClick={() => {
                                    let supervisor = formState.supervisor;
                                    supervisor["input"] =
                                        option.firstName +
                                        " " +
                                        option.lastName;
                                    supervisor["employeeNumber"] =
                                        option.employeeNumber;
                                    setFormState({
                                        ...formState,
                                        supervisor,
                                    });
                                }}
                            >
                                <img
                                    src={
                                        option.imageURL ||
                                        "/workerPlaceholder.png"
                                    }
                                    alt={"workerPhoto"}
                                />
                                <Typography noWrap>
                                    {`${option.firstName} ${option.lastName}`}
                                </Typography>
                            </div>
                        )
                    }
                    onInputChange={(_event, value, reason) => {
                        handleSupervisorTextfieldChange(value, reason);
                    }}
                />
                <br></br>
                <TextField
                    id="outlined-select-employment-type"
                    select
                    label="Employment type"
                    variant="outlined"
                    name="employmentType"
                    className={classes.textField}
                    size="small"
                    required
                    defaultValue=""
                >
                    <MenuItem key="hourly" value="hourly">
                        Hourly
                    </MenuItem>
                    <MenuItem key="salary" value="salary">
                        Salary
                    </MenuItem>
                </TextField>
                <TextField
                    label="Years Prior Experience"
                    name="YPE"
                    variant="outlined"
                    size="small"
                    type="number"
                    InputProps={{ inputProps: { min: 0, max: 70 } }}
                    className={classes.textField}
                />
                <br></br>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                        disableToolbar
                        variant="inline"
                        format="MM/dd/yyyy"
                        margin="normal"
                        label="Hire Date"
                        value={formState.selectedHireDate}
                        onChange={handleHireDateChange}
                        KeyboardButtonProps={{
                            "aria-label": "change date",
                        }}
                        required
                        name="hireDate"
                        autoOk={true}
                        className={classes.textField}
                    />
                </MuiPickersUtilsProvider>

                <h3>
                    <u>Location</u>
                </h3>
                <Autocomplete
                    options={locationAllId}
                    getOptionLabel={(option) => option}
                    className={classes.textField}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            name="physicalLocation"
                            variant="outlined"
                            label="Physical Location"
                            size="small"
                            required
                        />
                    )}
                />
                <Autocomplete
                    options={companyAllId}
                    getOptionLabel={(option) => option}
                    className={classes.textField}
                    onChange={handleCompanyTextFieldChange}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            name="companyCode"
                            variant="outlined"
                            label="Company"
                            placeholder="Acme Seeds Inc."
                            size="small"
                            required
                            className={classes.textField}
                        />
                    )}
                />
                <br></br>
                {formState.loadingState["officeCode"] ? (
                    <CircularProgress
                        size={"20px"}
                        className={classes.loading}
                    />
                ) : formState.officeCodesField["isVisible"] ? (
                    <Autocomplete
                        options={formState.officeCodesField["options"]}
                        getOptionLabel={(option) => option}
                        onChange={handleOfficeTextFieldChange}
                        className={classes.textField}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                name="officeCode"
                                variant="outlined"
                                label="Office Location"
                                placeholder="Corporate"
                                size="small"
                                required
                            />
                        )}
                    />
                ) : (
                    ""
                )}
                {formState.loadingState["groupCode"] ? (
                    <CircularProgress
                        size={"20px"}
                        classes={{ root: classes.loading }}
                    />
                ) : formState.groupCodesField["isVisible"] ? (
                    <Autocomplete
                        options={formState.groupCodesField["options"]}
                        getOptionLabel={(option) => option}
                        className={classes.textField}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                name="groupCode"
                                variant="outlined"
                                label="Group"
                                placeholder="Administration"
                                size="small"
                                required
                            />
                        )}
                    />
                ) : (
                    ""
                )}
                <h3>
                    <u>Skills</u>
                </h3>
                <Autocomplete
                    multiple
                    size="small"
                    options={skillsByCategory}
                    groupBy={(option) => option.category}
                    getOptionLabel={(option) => option.skill}
                    getOptionSelected={(option, value) =>
                        option.skill === value.skill
                    }
                    className={classes.skillsTextField}
                    onChange={(event, value) =>
                        setFormState({ ...formState, selectedSkills: value })
                    }
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant="outlined"
                            label="Skill"
                            size="small"
                        />
                    )}
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className={classes.submitBtn}
                >
                    {" "}
                    {formState.loadingState["submit"] ? (
                        <CircularProgress
                            size={"20px"}
                            className={classes.loading}
                        />
                    ) : (
                        "Add contractor"
                    )}
                </Button>
            </form>
            <Snackbar
                open={formState.snackBar["isOpen"]}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={formState.snackBar["severity"]}
                >
                    {formState.snackBar["message"]}
                </Alert>
            </Snackbar>
        </PageContainer>
    );
}

const mapStateToProps = (state) => {
    const { filters } = state;
    const isAdmin = state.appState.isAdmin;
    return {
        filterData: filters,
        isAdmin,
    };
};

export default withRouter(connect(mapStateToProps)(AddContractor));

const useStyles = makeStyles(() => ({
    root: {
        width: "50%",
        marginLeft: "auto",
        marginRight: "auto",
    },
    input: {
        display: "none",
    },
    button: {
        textTransform: "none",
        minWidth: 230,
        minHeight: 40,
    },
    textField: {
        width: 230,
        marginRight: 15,
        marginBottom: 10,
        display: "inline-grid",
    },
    skillsTextField: {
        minWidth: 230,
        maxWidth: 480,
    },
    submitBtn: {
        width: 200,
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: 20,
        backgroundColor: "#FF9900",
        color: "#000",
        "&:hover": {
            backgroundColor: "#FF9900",
            color: "#000",
        },
    },
    loading: {
        color: "#00569c",
    },
}));
