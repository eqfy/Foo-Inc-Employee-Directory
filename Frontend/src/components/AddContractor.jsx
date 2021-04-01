/* eslint-disable no-lone-blocks */
import React from "react";
import { PageContainer } from "./common/PageContainer";
import { TextField, Button, Typography, CircularProgress } from "@material-ui/core";
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
  } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { makeStyles } from "@material-ui/core/styles";
import { insertContractorAPI, getOfficeLocations, getGroups } from "../api/contractor";
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Redirect, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import S3FileUpload from "react-s3";
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import MuiPhoneNumber from 'material-ui-phone-number';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import MenuItem from '@material-ui/core/MenuItem';
import { getPredictiveSearchAPI } from "../../src/api/predictiveSearchAPI";
import { coordinatedDebounce } from "components/searchPage/helpers";
import { parseFullName } from "parse-full-name";
import { PagePathEnum } from "./common/constants";

function AddContractor(props) {
    const {
        filterData,
        isAdmin,
    } = props;

    const classes = useStyles();
    const {companyAllId, locationAllId, skillAllId} = filterData;
    
    let skillsByCategory = [];
    for (const category in skillAllId){
        for(const skill of skillAllId[category]){
            skillsByCategory.push({category, skill})
        }
    }

    const defaultState = {
        selectedHireDate: new Date(),
        fieldsStatusIsValid: {},
        errors: {},
        workPhone: '',
        workCell: '',
        snackBar: {},
        profilePic: {},
        supervisor: {},
        selectedCompanyCode: {},
        groupCodesField: {},
        officeCodesField: {},
        loadingState: {},
    }
    const [formState, setFormState] = React.useState(defaultState);
   // counter for timeout in case of supervisor input change
    const predictiveSearchTimer = {};

    React.useEffect(() => {
        if (formState.supervisor['input'] && formState.supervisor['input'].length >= 2) {
            coordinatedDebounce((name) => {
                const { first, last } = parseFullName(name);
                let supervisor = formState.supervisor;
                updateLoadingState('supervisor', true);
                getPredictiveSearchAPI(first, last)
                    .then((response) => {
                        supervisor['allSupervisors'] = response;
                        setFormState({
                            ...formState,
                            supervisor,
                        })
                    })
                    .catch((err) => {
                        console.error(
                            "Add Contractor Supervisor predictive search failed: ",
                            err
                        );
                    })
                    .finally(() => {
                        updateLoadingState('supervisor', false);
                    });
            }, predictiveSearchTimer)(formState.supervisor['input']?formState.supervisor['input']:'');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formState.supervisor['input']? formState.supervisor['input']:'']);

    if (!isAdmin) {
        return <Redirect to={`${PagePathEnum.LOGIN}?referrer=addContractor`}/>;
    }
    
    const handleSupervisorTextfieldChange = (value, reason) => {
        let supervisor = formState.supervisor;
        if (reason === "input") {
            supervisor['input'] = value;
            setFormState({
                ...formState,
                supervisor,
            })
        } else if (reason === "clear") {
            supervisor['input'] = '';
            setFormState({
                ...formState,
                supervisor,
            })
        }
    };

    async function handleCompanyTextFieldChange(event, values) {
        // get office locations
        let selectedCompanyCode = formState.selectedCompanyCode;
        let officeCodesField = formState.officeCodesField;
        let groupCodesField = formState.groupCodesField;
        officeCodesField['isVisible'] = false;
        officeCodesField['options'] = [];
        groupCodesField['isVisible'] = false;
        groupCodesField['options'] = [];
        selectedCompanyCode['value'] = values;
        updateLoadingState('officeCode', true);
        setFormState({
            ...formState,
            selectedCompanyCode,
            officeCodesField,
            groupCodesField,
        });
        await getOfficeLocations(values)
        .then((response) => {
            officeCodesField['isVisible'] = true;
            officeCodesField['options'] = response;
            setFormState({
                ...formState,
                officeCodesField,
            })
        })
        .catch((err) => {
            // handle errors
            console.log(err);
        })
        .finally(() => {
            updateLoadingState('officeCode', false);
        })
    }

    async function handleOfficeTextFieldChange (event, values) {
        // get group codes
        let groupCodesField = formState.groupCodesField;
        groupCodesField['isVisible'] = false;
        groupCodesField['options'] = [];
        updateLoadingState('groupCode', true);
        setFormState({
            ...formState,
            groupCodesField,
        });
        
        let requestPayload = {
            companyName: formState.selectedCompanyCode['value'],
            officeName: values,
        } 
        await getGroups(requestPayload)
        .then((response) => {
            // handle response array
            groupCodesField['isVisible'] = true;
            groupCodesField['options'] = response;
            setFormState({
                ...formState,
                groupCodesField,
            })
        })
        .catch((err) => {
            // handle errors
            console.log(err);
        })
        .finally(() => {
            updateLoadingState('groupCode', false);
        });
    }

    function Alert(props) {
        return <MuiAlert elevation={6} variant="filled" {... props} />
    }

    function showSnackbar(severity, message){
        let snackBar = formState.snackBar;
        snackBar['severity'] = severity;
        snackBar['isOpen'] = true;
        snackBar['message'] = message;
        setFormState({
                ...formState,
                snackBar,
        });
    }

    function updateLoadingState(type, isLoading){
        let loadingState = formState.loadingState;
        loadingState[type] = isLoading;
        setFormState({
            ...formState,
            loadingState,
        });
    }
    const handleSnackbarClose = (event, reason) => {
        
        let snackBar = formState.snackBar;
        snackBar['isOpen'] = false;
        setFormState({
            ...formState,
            snackBar,
        });
    }

    const validateFormField = (event) => {
        const fieldName = event.target.name;
        const fieldValue = event.target.value;

        let fieldsStatusIsValid = formState.fieldsStatusIsValid;
        let errors = formState.errors;
        switch(fieldName){
            case "email": {
                fieldsStatusIsValid[fieldName] = regexHelper(fieldValue, fieldName);
                errors[fieldName] = 'Incorrect email format';
                setFormState({
                    ...formState,
                    fieldsStatusIsValid,
                    errors,
                })
            }
             break;
            default: {
            }
        }
      };
    
    function regexHelper(fieldValue, fieldName){
        if(fieldName === 'email' && fieldValue !== '') return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fieldValue)
        return true;
    }

    const handleHireDateChange = (selectedHireDate) => {
        setFormState({
            ...formState,
            selectedHireDate,
        });
      };

    let selectedSkills = []; // objects of selected skills
    
    // NOT SECURE. CONSIDER UPLOADING IMAGE FROM BACKEND
    const config = {
        bucketName: "ae-directory",
        dirName: "images",
        region: "us-east-2",
        accessKeyId: "AKIAWGQ5OCKS4JJCMGEI",
        secretAccessKey: "1tskS1oRAaqOmDCj7CGNmIz0JnG0L1bpk5t8uA4n",
            
    }

    // THIS METHOD EXPOSES AWS AUTH KEYS TO CLIENT. 
    // TODO: Upload from backend or replace with react-s3-uploader or a different library
async function uploadProfilePicture (){
        let profilePic = formState.profilePic;
        await S3FileUpload.uploadFile(profilePic['file'], config)
        .then((data) => {
            profilePic['url'] = data.location;
            setFormState({
                ...formState,
                profilePic,
            })
        })
        .catch((err) => {
            console.log(err)
        })
    }

   const saveProfilePicture = (e) => {
        let file = e.target.files[0];
        let fileExt = (file.name).substring((file.name).lastIndexOf('.') + 1);
        let fileNameWithoutExt = file.name.replace(`.${fileExt}`,'');
        let newFileName = (fileNameWithoutExt + '_' + (new Date()).getTime() + '.' + fileExt).toLowerCase();
        
        let profilePic = formState.profilePic;
        profilePic['file'] = new File([e.target.files[0]], newFileName);
        profilePic['name'] = file.name;
        setFormState({
            ...formState,
            profilePic,
        })
    }

    function fieldErrorHelper(fieldName){
        return formState.fieldsStatusIsValid[fieldName] === undefined? 
        false:
        !formState.fieldsStatusIsValid[fieldName];
    }

    function fieldHelperText(fieldName){
        return !formState.fieldsStatusIsValid[fieldName]? formState.errors[fieldName]: '';
    }
    async function handleSubmit(event){
        event.preventDefault();

        let skills = "";
        for (const selectedSkill of selectedSkills){
            skills += selectedSkill.category+':::'+selectedSkill.skill+'|||';
        }
        skills = skills.slice(0,-3);


        if(!event.target.groupCode || !event.target.officeCode) {
            showSnackbar('error','Operation failed. Missing office location or group.');
            return;
        }

        // validate email field
        if(!regexHelper(event.target.email.value, "email")){
            showSnackbar('error','Operation failed. Email field is invalid.');
            return;
         }

        updateLoadingState('submit', true);
        // Upload profile pic
        await uploadProfilePicture();

        const details = {
            FirstName: event.target.firstName.value,
            LastName: event.target.lastName.value,
            Email: event.target.email.value,
            WorkPhone: event.target.workPhone.value,
            WorkCell: event.target.workCell.value === '+1' ? '': event.target.workCell.value,
            Title: event.target.title.value,
            SupervisorEmployeeNumber: formState.supervisor['employeeNumber'],
            HireDate: event.target.hireDate.value,
            TerminationDate: null, 
            PhysicalLocation: event.target.physicalLocation.value,
            GroupCode: event.target.groupCode.value,
            CompanyCode: event.target.companyCode.value,
            OfficeCode: event.target.officeCode.value,
            skills: skills,
            YearsPriorExperience: event.target.YPE.value,
            PhotoUrl: formState.profilePic['url']? formState.profilePic['url']: '',
            EmploymentType: event.target.employmentType.value,
        }
        console.log(details);
        // Submit form to backend
        await insertContractorAPI(details).then((response) => {
            // update snackbar success
            showSnackbar('success','Contractor added successfully');
            // window.location.reload();
        })
        .catch((err) => {
            console.log(err);
            // update snackbar failed
            showSnackbar('error','Operation failed. Please try again');
            })
        .finally(() => {
        updateLoadingState('submit', false);
        })
        }
        
        return (
            <PageContainer className= {classes.root}>
                <form onSubmit = {handleSubmit}>
                <h3><u>Basic information</u></h3>
                    <TextField 
                        className= {classes.textField}
                        label="First Name" 
                        placeholder="John" 
                        name="firstName" 
                        variant="outlined" 
                        size="small" 
                        required 
                        onChange={validateFormField} 
                        error = {fieldErrorHelper("firstName")}
                        helperText={fieldHelperText("firstName")}
                        />
                    
                    <TextField 
                        className= {classes.textField}
                        label="Last Name"
                        placeholder="Doe" 
                        name="lastName" 
                        variant="outlined" 
                        size="small" 
                        required 
                        onChange={validateFormField} 
                        error = {fieldErrorHelper("lastName")}
                        helperText={fieldHelperText("lastName")}/>
                        <br></br>
                    <TextField 
                        className= {classes.textField}
                        label="Email"
                        placeholder="john.doe@ae.com" 
                        name="email" 
                        variant="outlined" 
                        size="small" 
                        required
                        onChange={validateFormField} 
                        error = {fieldErrorHelper("email")}
                        helperText={fieldHelperText("email")}/>
                    <MuiPhoneNumber 
                        defaultCountry={'ca'} 
                        label="Work Phone"  
                        name="workPhone" 
                        variant="outlined" 
                        size="small" 
                        required
                        className= {classes.textField}/>
                        <br></br>
                    <MuiPhoneNumber 
                        defaultCountry={'ca'} 
                        label="Cell Phone"  
                        name="workCell" 
                        variant="outlined" 
                        size="small" 
                        className= {classes.textField}
                        />
                    <input
                        accept="image/*"
                        className={classes.input}
                        id="contained-button-file"
                        multiple
                        type="file"
                        onChange={ saveProfilePicture }
                        // onChange = { uploadImageAmplify }
                    />
                        <label htmlFor="contained-button-file">
                            <Button variant="outlined" component="span" startIcon={ <AccountBoxIcon /> } className= {classes.button}>
                        {formState.profilePic['name'] === undefined? 'Upload Profile Image': formState.profilePic['name']}
                            </Button>
                        </label>
                    <h3><u>Position Details</u></h3>
                    <TextField 
                            label="Title" 
                            placeholder="Contractor" 
                            name="title" 
                            variant="outlined" 
                            size="small" 
                            required
                            onChange={validateFormField} 
                            error = {fieldErrorHelper("title")}
                            helperText={fieldHelperText("title")}
                            className= {classes.textField}
                        />
                    <Autocomplete
                            options={formState.supervisor['allSupervisors']? formState.supervisor['allSupervisors']: 
                                        (formState.loadingState['supervisor'] ? ['loading']: [])}
                            getOptionLabel={() => formState.supervisor['input']? formState.supervisor['input']:''}
                            className= {classes.textField}
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
                            renderOption={(option) => (
                                formState.loadingState['supervisor'] ? (
                                    <div className={"search-dropdown-entry"}>
                                        <CircularProgress
                                            size={"20px"}
                                            classes={{ root: classes.loading }}
                                        />
                                    </div>
                                ) : (
                                    <div className={"search-dropdown-entry"}
                                            onClick={() => {
                                                let supervisor = formState.supervisor;
                                                supervisor['input'] = option.firstName + " " + option.lastName;
                                                supervisor['employeeNumber'] = option.employeeNumber;
                                                setFormState({
                                                    ...formState,
                                                    supervisor,
                                                })
                                            }}
                                        >
                                            <img
                                                src={option.imageURL || "/workerPlaceholder.png"}
                                                alt={"workerPhoto"}
                                            />
                                            <Typography noWrap>
                                                {`${option.firstName} ${option.lastName}`}
                                            </Typography>
                                        </div>
                                )
                            )}
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
                            className= {classes.textField}
                            size="small"
                            required
                            defaultValue="hourly"
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
                        InputProps={{ inputProps: { min: 0, max: 50 } }}
                        className= {classes.textField}
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
                                    'aria-label': 'change date',
                                }}
                                required
                                name="hireDate"
                                autoOk={true}
                                className= {classes.textField}
                                />
                        </MuiPickersUtilsProvider>

                    <h3><u>Location</u></h3>
                        <Autocomplete
                            options={locationAllId}
                            getOptionLabel={(option) => option}
                            className= {classes.textField}
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
                            className= {classes.textField}
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
                                    className= {classes.textField}
                                    />
                        )} />
                         <br></br>
                        {formState.loadingState['officeCode']? 
                        <CircularProgress
                                size={"20px"}
                                className={ classes.loading }
                            />
                        
                        :formState.officeCodesField['isVisible']? 
                        <Autocomplete
                            options={formState.officeCodesField['options']}
                            getOptionLabel={(option) => option}
                            onChange={handleOfficeTextFieldChange}
                            className= {classes.textField}
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
                        />: ''}
                    { formState.loadingState['groupCode']? 
                        <CircularProgress
                                size={"20px"}
                                classes={{ root: classes.loading }}
                            />
                            
                        :formState.groupCodesField['isVisible']? 
                        <Autocomplete
                            options={formState.groupCodesField['options']}
                            getOptionLabel={(option) => option}
                            className= {classes.textField}
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
                        />:''}
                        <h3><u>Skills</u></h3>
                        <Autocomplete
                            multiple
                            size="small"
                            options={skillsByCategory}
                            groupBy={(option) => option.category}
                            getOptionLabel={(option) => option.skill}
                            getOptionSelected={(option, value) => option.skill === value.skill}
                            className= {classes.skillsTextField}
                            onChange={(event, value) => selectedSkills = value}
                            renderInput={(params) => (
                            <TextField {...params} variant="outlined" label="Skill" size="small" />
                            )}
                        />
                <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary"
                    className= {classes.submitBtn}
                    > {
                    formState.loadingState['submit']? 
                    <CircularProgress
                        size={"20px"}
                        className={ classes.loading }
                    />: "Add contractor" 
                    }
                    </Button>
                </form>
                <Snackbar open={formState.snackBar['isOpen']} autoHideDuration={3000} onClose={handleSnackbarClose}>
                    <Alert onClose={handleSnackbarClose} severity={formState.snackBar['severity']}>
                    {formState.snackBar['message']}
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

    export default withRouter(
        connect(mapStateToProps)(AddContractor)
    );

    const useStyles = makeStyles(() => ({
        root: {
            width: "50%",
            marginLeft: "auto",
            marginRight: "auto",
        },
        input: {
            display: 'none',
        },
        button: {
            textTransform: 'none',
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
            maxWidth: 480
        },
        submitBtn: {
            width: 200,
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: 20,
            backgroundColor: "#FF9900",
            color: "#000",
            '&:hover': {
                backgroundColor: "#FF9900",
                color: "#000"
            }
        },
        loading: {
            color: "#00569c",
        },
    }));