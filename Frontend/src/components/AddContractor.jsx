/* eslint-disable no-lone-blocks */
import React from "react";
import { PageContainer } from "./common/PageContainer";
import { Grid, TextField, Button} from "@material-ui/core";
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
  } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { makeStyles } from "@material-ui/core/styles";
import { insertContractorAPI } from "../api/contractor";
import Autocomplete from '@material-ui/lab/Autocomplete';
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import S3FileUpload from "react-s3";
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import MuiPhoneNumber from 'material-ui-phone-number';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';

function AddContractor(props) {

    const classes = useStyles();

    const {
        filterData
    } = props;
    
    const {companyAllId, departmentAllId, locationAllId, skillAllId} = filterData;
    
    let skillsByCategory = [];
    for (const category in skillAllId){
        for(const skill of skillAllId[category]){
            skillsByCategory.push({category, skill})
        }
    }

    const [formState, setFormState] = React.useState({
        selectedHireDate: new Date(),
        selectedTerminateDate: new Date(),
        fieldsStatusIsValid: {},
        errors: {},
        workPhone: '',
        cellPhone: '',
        snackBar: {},
    })

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

    const validateFormField = (event) => {
        const fieldName = event.target.name;
        const fieldValue = event.target.value;

        let fieldsStatusIsValid = formState.fieldsStatusIsValid;
        let errors = formState.errors;
        switch(fieldName){
            case "firstName":
            case "lastName":
            case "title":
            case "supervisor":
            case "physicalLocation":
            case "groupType":
            case "companyName":
            case "officeLocation": {
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
            case "title":
            case "supervisor":
            case "physicalLocation":
            case "groupType":
            case "companyName":
            case "officeLocation":regex = '([a-zA-Z .])'; break;
            case "workPhone": 
            case "cellPhone": {} break;
         //   case "email": regex = '^(([^<>()[.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$'; break;
            default: {}
        }

        if(fieldName === 'email') return new RegExp(regex).test(fieldValue);
        
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
      
    const handleTerminateDateChange = (selectedTerminateDate) => {
        let fieldsStatusIsValid = formState.fieldsStatusIsValid;
        let errors = formState.errors;
        fieldsStatusIsValid['terminationDate'] = !(selectedTerminateDate < formState.selectedHireDate);
        errors['terminationDate'] = 'Contract end date cannot be before hire date';
        setFormState({
            ...formState,
            selectedTerminateDate,
            fieldsStatusIsValid,
            errors,
        });
    };
    
    let [photoURL, setPhotoURL] = React.useState('');
    // TODO: 9  Page styling
    // TODO: 6. Cognito log in page, auth flow
    // TODO: 4. Fix email validation
    // TODO: 5. Progress bar for addContractor
    // TODO: 7: Predictive search for supervisor
    // TODO: 8: Refractor
    // TODO: 10: Front-end/backend bug where I can only add one skill? (Index out of bounds exception)
    // TODO: 11: Confirm with AE -> will we need to support company/groups/locations/officecodes not in db?
    // TODO: 12: fix -> replace physical location with office location after confirmation above
    // TODO: 11: Confirm with AE -> will contractor's employment type always be hourly?

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
    const uploadProfilePicture = (e) => {
        let file = e.target.files[0];
        let fileExt = file.name.split('.')[file.name.split('.').length-1];
        let fileNameWithoutExt = file.name.replace(`.${fileExt}`,'');
        let newFileName = fileNameWithoutExt + '_' + (new Date()).getTime() + '.' + fileExt;
        const profilePic = new File([e.target.files[0]], newFileName);
        S3FileUpload.uploadFile(profilePic, config)
        .then((data) => {
            setPhotoURL(data.location);
        })
        .catch((err) => {
            console.log(err)
            })
        }

    function uploadedPPicName(){
        const rawName = photoURL.substring(photoURL.lastIndexOf('/') + 1);
        return (rawName.substring(0, rawName.indexOf('_')) + rawName.substring(rawName.lastIndexOf('.'))).toLowerCase();
    }

    function fieldErrorHelper(fieldName){
        return formState.fieldsStatusIsValid[fieldName] === undefined? 
        false:
        !formState.fieldsStatusIsValid[fieldName];
    }

    function fieldHelperText(fieldName){
        return !formState.fieldsStatusIsValid[fieldName]? formState.errors[fieldName]: '';
    }
    const handleSubmit = (event) => {
        event.preventDefault();

        let skills = "";
        for (const selectedSkill of selectedSkills){
            skills += selectedSkill.category+':::'+selectedSkill.skill+'|||';
        }
        skills = skills.slice(0,-3);

        const details = {
            FirstName: event.target.firstName.value,
            LastName: event.target.lastName.value,
            Email: event.target.email.value,
            WorkPhone: event.target.workPhone.value,
            WorkCell: event.target.cellPhone.value === '+1' ? '': event.target.cellPhone.value,
            Title: event.target.title.value,
            SupervisorEmployeeNumber: "10001", // TODO: Replace with  actual supervisor employee number once we have predictive search
            HireDate: event.target.hireDate.value,
            TerminationDate: event.target.terminationDate.value, 
            PhysicalLocation: event.target.physicalLocation.value,
            GroupCode: event.target.groupType.value,
            CompanyCode: event.target.companyName.value,
            OfficeCode: event.target.officeLocation.value,
            skills: skills,
            YearsPriorExperience: event.target.YPE.value,
            PhotoUrl: photoURL,
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
                        onChange={ uploadProfilePicture }
                    />
                        <label htmlFor="contained-button-file">
                            <Button variant="outlined" component="span" startIcon={ <AccountBoxIcon /> } className= {classes.button}>
                        {photoURL === ''? 'Upload Profile Image': uploadedPPicName()}
                            </Button>
                        </label>
                    <h3><u>Position Details</u></h3>
                    <TextField 
                            label="Title" 
                            placeholder="Manager" 
                            name="title" 
                            variant="outlined" 
                            size="small" 
                            required
                            onChange={validateFormField} 
                            error = {fieldErrorHelper("title")}
                            helperText={fieldHelperText("title")}
                            className= {classes.textField}
                        />
                        <TextField 
                            label="Supervisor"
                            placeholder="James Smith" 
                            name="supervisor" 
                            variant="outlined" 
                            size="small" 
                            required
                            onChange={validateFormField} 
                            error = {fieldErrorHelper("supervisor")}
                            helperText={fieldHelperText("supervisor")}
                            className= {classes.textField}
                    />
                    <br></br>
                    <FormControl 
                            variant="outlined" 
                            className={classes.textField} 
                            size="small">
                                <InputLabel id="employment-type-label">Employment Type</InputLabel>
                                <Select
                                labelId="employment-type-label"
                                label="Employment Type"
                                >
                                    <MenuItem value="hourly">Hourly</MenuItem>
                                    <MenuItem value="salary">Salary</MenuItem>
                                </Select>
                    </FormControl>
                    <TextField 
                        label="Years Prior Experience"
                        name="YPE" 
                        variant="outlined" 
                        size="small"
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
                                <KeyboardDatePicker
                                disableToolbar
                                variant="inline"
                                format="MM/dd/yyyy"
                                margin="normal"
                                id="date-picker-inline"
                                label="Contract End Date"
                                value={formState.selectedTerminateDate}
                                onChange={handleTerminateDateChange}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                                required
                                name="terminationDate"
                                error = {fieldErrorHelper("terminationDate")}
                                helperText={fieldHelperText("terminationDate")}
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
                            options={locationAllId}
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
        const {
            filters,
        } = state;
        return {
            filterData: filters,
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