import React, { useState } from "react";
import { useHistory, useLocation } from 'react-router';
import { PageContainer } from './common/PageContainer';
import { Button, CircularProgress, FormControl, Grid, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField } from '@material-ui/core';
import { connect } from 'react-redux';
import { Auth } from 'aws-amplify';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { setAdmin, setSnackbarState } from 'actions/generalAction';
import { PagePathEnum } from './common/constants';

function Login(props) {
  const { isAdmin, setAdmin, setSnackbarState } = props;
  const { search } = useLocation();
  const { push } = useHistory();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loggedInMessage, setLoggedInMessage] = useState(null);

  const toggleShowPassword = () => {
      setShowPassword(!showPassword);
  }

  if (isAdmin) {
      Auth.currentAuthenticatedUser().then((user) => {
          setLoggedInMessage(`Logged in as ${user.username}`);
      }).catch(() => { /* Ignore error */ });
  }

  const handleLogin = async event => {
    setLoading(true);
    Auth.signIn(event.target.username.value, event.target.password.value)
        .then(() => {
            setAdmin(true);
            if (search === '?referrer=addContractor') {
                push(PagePathEnum.NEWCONTRACTOR);
            }
            setSnackbarState({
                open: true,
                severity: "success",
                message: "Successfully logged in",
            });
        })
        .catch((e) => {
            setSnackbarState({
                open: true,
                severity: "error",
                message: e.message,
            });
        })
        .finally(() => {
            setLoading(false);
        });
  }

  const handleLogout = async () => {
    setLoading(true);
    Auth.signOut()
        .then(() => {
            setAdmin(false);
            setLoggedInMessage(null);
            setSnackbarState({
                open: true,
                severity: "success",
                message: "Successfully logged out",
            });
        })
        .catch((e) => {
            setSnackbarState({
                open: true,
                severity: "error",
                message: e.message,
            });
        })
        .finally(() => {
            setLoading(false);
        })
  }

  const handleSubmit = (event) => {
    event.preventDefault();

      if (isAdmin) {
          handleLogout();
      } else {
          handleLogin(event);
      }
  }

  return (
    <PageContainer>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} justify="center">
            <Grid item xs={3}>
                <TextField label="Username" placeholder="johndoe" name="username" variant="outlined" size="small" required fullWidth disabled={isAdmin} />
            </Grid>
        </Grid>
        <Grid container spacing={2} justify="center">
            <Grid item xs={3}>
                <FormControl variant="outlined" size="small" required fullWidth disabled={isAdmin}>
                    <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={toggleShowPassword}
                                edge="end"
                            >
                                {showPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                        </InputAdornment>
                        }
                        labelWidth={85}
                    />
                </FormControl>
            </Grid>
        </Grid>
        <Grid container spacing={2} justify="center">
            <Grid item>
                <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={20} color="inherit" /> : isAdmin ? "Log out" : "Log in"}
                </Button>
            </Grid>
        </Grid>
        {!!loggedInMessage && (
            <Grid container spacing={2} justify="center">
                <Grid item>
                    {loggedInMessage}
                </Grid>
            </Grid>
        )}
      </form>
    </PageContainer>
  )
}

const mapStateToProps = (state) => ({
    isAdmin: state.appState.isAdmin,
});

const mapDispatchToProps = (dispatch) => ({
    setAdmin: (isAdmin) => dispatch(setAdmin(isAdmin)),
    setSnackbarState: (snackbarState) => dispatch(setSnackbarState(snackbarState)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Login);
