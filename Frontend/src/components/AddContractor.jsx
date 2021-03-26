/* eslint-disable no-lone-blocks */
import React from "react";
import { PageContainer } from "./common/PageContainer";
import { Grid, TextField, Button, Typography,} from "@material-ui/core";
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
  } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import makeStyles from "@material-ui/core/styles/makeStyles";
import { insertContractorAPI } from "../api/contractor";
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Redirect, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import S3FileUpload from "react-s3";
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import MuiPhoneNumber from 'material-ui-phone-number';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import MenuItem from '@material-ui/core/MenuItem';
import { PagePathEnum } from './common/constants';
import { Storage } from 'aws-amplify';
import { getPredictiveSearchAPI } from "../../src/api/predictiveSearchAPI";
import { coordinatedDebounce } from "components/searchPage/helpers";
import { parseFullName } from "parse-full-name";

function AddContractor(props) {
    const {
        filterData,
        isAdmin,
    } = props;

    const classes = useStyles();
    const {companyAllId, departmentAllId, locationAllId, skillAllId} = filterData;
    
    // TODO: Fetch from backend/redux
    const tempLocations = ['Corporate', 'Vancouver', 'Prince George'];

    let skillsByCategory = [];
    for (const category in skillAllId){
        for(const skill of skillAllId[category]){
            skillsByCategory.push({category, skill})
        }
    }

    const [formState, setFormState] = React.useState({
        selectedHireDate: new Date(),
        fieldsStatusIsValid: {},
        errors: {},
        workPhone: '',
        cellPhone: '',
        snackBar: {},
        profilePic: {},
        supervisor: {}
    })
   // counter for timeout in case of supervisor input change
    const predictiveSearchTimer = {};

    React.useEffect(() => {
        if (formState.supervisor['input'] && formState.supervisor['input'].length >= 2) {
            coordinatedDebounce((name) => {
                const { first, last } = parseFullName(name);
                let supervisor = formState.supervisor;
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
                    });
            }, predictiveSearchTimer)(formState.supervisor['input']?formState.supervisor['input']:'');
        }
    }, [formState.supervisor['input']?formState.supervisor['input']:'']);

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

    function Alert(props) {
        return <MuiAlert elevation={6} variant="filled" {... props} />
    }
    const handleSnackbarClose = (event, reason) => {
        
        let snackBar = formState.snackBar;
        snackBar['isOpen'] = false;
        setFormState({
            ...formState,
            snackBar,
        });
    }

    // TODO: fix 'no credentials' error, add progress spinner
    async function uploadImageAmplify(e) {
        const file = e.target.files[0];
        Storage.put(file.name, file)
        .then (result => console.log(result))
        .catch(err => console.log(err));  
      }

    const validateFormField = (event) => {
        const fieldName = event.target.name;
        const fieldValue = event.target.value;

        let fieldsStatusIsValid = formState.fieldsStatusIsValid;
        let errors = formState.errors;
        switch(fieldName){
            case "firstName":
            case "lastName":
            case "title": {
                fieldsStatusIsValid[fieldName] = regexHelper(fieldValue, fieldName);
                errors[fieldName] = 'Alpabetical characters only';
                setFormState({
                    ...formState,
                    fieldsStatusIsValid,
                    errors,
                })
            }
            break;
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
        let regex = '';
        switch(fieldName){
            case "firstName":
            case "lastName":
            case "title": regex = '([a-zA-Z .])'; break;
            default: {}
        }

        if(fieldName === 'email') return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fieldValue)
        
        let strLen = fieldValue.length;
        let isValid = true;

        while (strLen--) {
          isValid = isValid && new RegExp(regex).test(fieldValue.charAt(strLen));
        }
        return isValid;
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
    // TODO: Fix bug where trying to upload image multiple times (without page refresh) fails
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

        // Upload profile pic
        await uploadProfilePicture();

        const details = {
            FirstName: event.target.firstName.value,
            LastName: event.target.lastName.value,
            Email: event.target.email.value,
            WorkPhone: event.target.workPhone.value,
            WorkCell: event.target.cellPhone.value === '+1' ? '': event.target.cellPhone.value,
            Title: event.target.title.value,
            SupervisorEmployeeNumber: formState.supervisor['employeeNumber'], // TODO: Replace with  actual supervisor employee number once we have predictive search
            HireDate: event.target.hireDate.value,
            TerminationDate: null, 
            PhysicalLocation: event.target.physicalLocation.value,
            GroupCode: event.target.groupType.value,
            CompanyCode: event.target.companyName.value,
            OfficeCode: event.target.officeLocation.value,
            skills: skills,
            YearsPriorExperience: event.target.YPE.value,
            PhotoUrl: formState.profilePic['url'],
            EmploymentType: event.target.employmentType.value,
        }
        // Submit form to backend
        insertContractorAPI(details).then((response) => {
            // update snackbar success
            let snackBar = formState.snackBar;
            snackBar['severity'] = 'success';
            snackBar['isOpen'] = true;
            snackBar['message'] = 'Contractor added successfully';

            setFormState({
                ...formState,
                snackBar,
            });
        })
        .catch((err) => {
            console.error(err);
            // update snackbar failed
            let snackBar = formState.snackBar;
            snackBar['severity'] = 'error';
            snackBar['isOpen'] = true;
            snackBar['message'] = 'Operation failed. Please try again';

            setFormState({
                ...formState,
                snackBar,
            });
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
                        name="cellPhone" 
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
                            options={formState.supervisor['allSupervisors']? formState.supervisor['allSupervisors']: []}
                            getOptionLabel={() => formState.supervisor['input']? formState.supervisor['input']:''}
                            className= {classes.textField}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    placeholder="James Smith" 
                                    variant="outlined"
                                    label="Supervisor"
                                    size="small"
                                />
                                )}
                            renderOption={(option) => (
                                        <div
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
                            )}
                            inputValue={ formState.supervisor['input']? formState.supervisor['input']:'' }
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
                    <Grid container spacing={1} xs={9}>
                    <Grid item xs={6}>
                        <Autocomplete
                            options={locationAllId}
                            getOptionLabel={(option) => option}
                            renderInput={(params) => (
                                <TextField 
                                    {...params} 
                                    name="physicalLocation"
                                    variant="outlined" 
                                    label="Physical Location"
                                    size="small"
                                    required
                                    className= {classes.textField}
                                    />
                        )}
                        />
                        </Grid>
                        <Grid item xs={6}>
                    <Autocomplete
                            options={departmentAllId}
                            getOptionLabel={(option) => option}
                            renderInput={(params) => (
                                <TextField 
                                    {...params} 
                                    name="groupType"
                                    variant="outlined" 
                                    label="Group"
                                    placeholder="Administration" 
                                    size="small"
                                    required
                                    className= {classes.textField}
                                    />
                        )}
                        />
                        </Grid>
                        </Grid>
                <Grid container spacing={1} xs={9}>
                    <Grid item xs={6}>
                    <Autocomplete
                            options={companyAllId}
                            getOptionLabel={(option) => option}
                            renderInput={(params) => (
                                <TextField 
                                    {...params} 
                                    name="companyName"
                                    variant="outlined" 
                                    label="Company"
                                    placeholder="Acme Seeds Inc." 
                                    size="small"
                                    required
                                    className= {classes.textField}
                                    />
                        )}
                        />
                        </Grid>
                        <Grid item xs={6}>
                        <Autocomplete
                            options={tempLocations}
                            getOptionLabel={(option) => option}
                            renderInput={(params) => (
                                <TextField 
                                    {...params} 
                                    name="officeLocation"
                                    variant="outlined" 
                                    label="Office Location"
                                    placeholder="Corporate" 
                                    size="small"
                                    required
                                    className= {classes.textField}
                                    />
                        )}
                        />
                        </Grid>
                        </Grid>
                        <h3><u>Skills</u></h3>
                        <Grid container spacing={1} xs={12}>
                    <Grid item xs={9}>
                        <Autocomplete
                            multiple
                            size="small"
                            options={skillsByCategory}
                            getOptionLabel={(option) => option.skill}
                            getOptionSelected={(option, value) => option.skill === value.skill}
                            onChange={(event, value) => selectedSkills = value}
                            renderInput={(params) => (
                            <TextField {...params} variant="outlined" label="Skill" size="small" />
                            )}
                        />
                        </Grid>
                        </Grid>
                <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary"
                    className= {classes.submitBtn}
                    >Add contractor</Button>
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
            display: "inline-grid"
        },
        submitBtn: {
            width: "30%",
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: 20,
            backgroundColor: "#FF9900",
            color: "#000",
            '&:hover': {
                backgroundColor: "#FF9900",
                color: "#000"
            }
        }
    }));