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

function AddContractor(props) {

    const classes = useStyles();

    const {
        filterData
    } = props;
    const availableSkills = filterData['skillAllId'];
    
    let skillsByCategory = [];
    for (const category in availableSkills){
        for(const skill of availableSkills[category]){
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
    })
    
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
    // TODO: 2. Connect to backend + test
    // TODO: 5. Update snackbar on success/failed, clear fields
    // TODO: 6. Cognito log in page
    // TODO: 4. Fix email validation
    // TODO: 2. Predictive for physical location, group, company, office location
    // TODO: 7: Predictive search for supervisor
    // TODO: 8: Refractor
    // TODO: 9 Page styling


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
        EmploymentType: "hourly"
    }

    // Submit form to backend
    let response = insertContractorAPI(details).then((response) => {
        // update snackbar
        console.log(response);
     })
    .catch((err) => {
        console.log(err);
        })

    }
    
    return (
        <PageContainer className= {classes.root}>
            <form onSubmit = {handleSubmit}>
            <h3><u>Basic information</u></h3>
            <Grid container spacing={1} xs={8}>
                <Grid item xs={6}>
                <TextField 
                    label="First Name" 
                    placeholder="John" 
                    name="firstName" 
                    variant="outlined" 
                    size="small" 
                    required 
                    onChange={validateFormField} 
                    error = {fieldErrorHelper("firstName")}
                    helperText={fieldHelperText("firstName")}/>
                </Grid>
                <Grid item xs={6}>
                <TextField 
                    label="Last Name"
                    placeholder="Doe" 
                    name="lastName" 
                    variant="outlined" 
                    size="small" 
                    required 
                    onChange={validateFormField} 
                    error = {fieldErrorHelper("lastName")}
                    helperText={fieldHelperText("lastName")}/>
                </Grid>
                <Grid item xs={6}>
                <TextField label="Email"
                    placeholder="john.doe@ae.com" 
                    name="email" 
                    variant="outlined" 
                    size="small" 
                    required
                    onChange={validateFormField} 
                    error = {fieldErrorHelper("email")}
                    helperText={fieldHelperText("email")}/>
                </Grid>
                <Grid item xs={6}>
                <MuiPhoneNumber defaultCountry={'ca'} 
                    label="Work Phone"  
                    name="workPhone" 
                    variant="outlined" 
                    size="small" 
                    required/>
                </Grid>
                <Grid item xs={6}>
                <MuiPhoneNumber defaultCountry={'ca'} 
                    label="Cell Phone"  
                    name="cellPhone" 
                    variant="outlined" 
                    size="small" 
                    />
                </Grid>
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
                </Grid>
                <h3><u>Position Details</u></h3>
                <Grid container spacing={1} xs={8}>
                <Grid item xs={6}>
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
                     />
                </Grid>
                <Grid item xs={6}>
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
                   />
                </Grid>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid item xs={6}>
                        <Grid container justify="space-around">
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
                            />
                        </Grid>
                    </Grid>
                    <Grid item xs={6}>
                        <Grid container justify="space-around">
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
                            />
                        </Grid>
                    </Grid>
                    </MuiPickersUtilsProvider>
                </Grid>

                <h3><u>Location</u></h3>
                <Grid container spacing={1} xs={8}>
                <Grid item xs={6}>
                    <TextField 
                        label="Physical Location" 
                        placeholder="Victoria" 
                        name="physicalLocation" 
                        variant="outlined" 
                        size="small" 
                        required
                        onChange={validateFormField} 
                        error = {fieldErrorHelper("physicalLocation")}
                        helperText={fieldHelperText("physicalLocation")}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField 
                        label="Group" 
                        placeholder="Administration" 
                        name="groupType" 
                        variant="outlined" 
                        size="small"
                        required
                        onChange={validateFormField} 
                        error = {fieldErrorHelper("groupType")}
                        helperText={fieldHelperText("groupType")}
                    />
                </Grid>
            <Grid item xs={6}>
                    <TextField 
                        label="Company" 
                        placeholder="Acme Seeds Inc" 
                        name="companyName" 
                        variant="outlined" 
                        size="small" 
                        required
                        onChange={validateFormField} 
                        error = {fieldErrorHelper("companyName")}
                        helperText={fieldHelperText("companyName")}
                    />
                       </Grid>
                       <Grid item xs={6}>
                    <TextField 
                        label="Office Location" 
                        placeholder="Vancouver" 
                        name="officeLocation" 
                        variant="outlined" 
                        size="small" 
                        required    
                        onChange={validateFormField} 
                        error = {fieldErrorHelper("officeLocation")}
                        helperText={fieldHelperText("officeLocation")}
                    />
                       </Grid>
                       </Grid>
                       <h3><u>Skills</u></h3>
            <Grid container spacing={1} xs={8}>
                <Grid item xs={12}>
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
                <Grid item xs={12}>
                    <TextField label="Years Prior Experience" name="YPE" variant="outlined" size="small"/>
                </Grid>
            </Grid>
            <Button type="submit" variant="contained">Add contractor</Button>
            </form>
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
    }
  }));