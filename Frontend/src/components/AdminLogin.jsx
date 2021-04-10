import React, { useState } from "react";
import { useHistory, useLocation } from "react-router";
import { PageContainer } from "./common/PageContainer";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import InputLabel from "@material-ui/core/InputLabel";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import TextField from "@material-ui/core/TextField";
import { connect } from "react-redux";
import { Auth } from "aws-amplify";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { setAdmin, setSnackbarState } from "actions/generalAction";
import { PagePathEnum } from "./common/constants";
import logo from "./../assets/ae_logo.png";

const useStyles = makeStyles({
    formContainer: {
        marginTop: "calc(50vh - 250px)",
    },
    logoTitleContainer: {
        textAlign: "center",
        fontSize: 30,
        marginBottom: 50,
    },
    logo: {
        display: "block",
        marginLeft: "auto",
        marginRight: "auto",
        width: 200,
        marginBottom: 30,
    },
    textField: {
        minWidth: 300,
    },
    logButton: {
        marginTop: 30,
        color: "white",
        "&.logIn": {
            backgroundColor: "#009900",
            "&:hover": {
                backgroundColor: "#006600",
            },
        },
        backgroundColor: "#cc0000",
        "&:hover": {
            backgroundColor: "#800000",
        },
    },
});

function Login(props) {
    const { isAdmin, setAdmin, setSnackbarState } = props;
    const { search } = useLocation();
    const { push } = useHistory();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loggedInMessage, setLoggedInMessage] = useState(null);

    const styles = useStyles();

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    if (isAdmin) {
        Auth.currentAuthenticatedUser()
            .then((user) => {
                setLoggedInMessage(`Logged in as ${user.username}`);
            })
            .catch(() => {
                /* Ignore error */
            });
    }

    const handleLogin = async (event) => {
        setLoading(true);
        Auth.signIn(event.target.username.value, event.target.password.value)
            .then(() => {
                setAdmin(true);
                if (search === "?referrer=addContractor") {
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
    };

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
            });
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (isAdmin) {
            handleLogout();
        } else {
            handleLogin(event);
        }
    };

    return (
        <PageContainer>
            <div className={styles.formContainer}>
                <form onSubmit={handleSubmit} className={styles.formContainer}>
                    <Grid container spacing={2} justify="center">
                        <Grid
                            item
                            xs={3}
                            classes={{ root: styles.logoTitleContainer }}
                        >
                            <img
                                className={styles.logo}
                                src={logo}
                                alt={logo}
                            />
                            <b>Admin Login Window</b>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} justify="center">
                        <Grid item xs={3} classes={{ root: styles.textField }}>
                            <TextField
                                label="Username"
                                placeholder="johndoe"
                                name="username"
                                variant="outlined"
                                size="small"
                                required
                                fullWidth
                                disabled={isAdmin}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} justify="center">
                        <Grid item xs={3} classes={{ root: styles.textField }}>
                            <FormControl
                                variant="outlined"
                                size="small"
                                required
                                fullWidth
                                disabled={isAdmin}
                            >
                                <InputLabel htmlFor="outlined-adornment-password">
                                    Password
                                </InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={toggleShowPassword}
                                                edge="end"
                                            >
                                                {showPassword ? (
                                                    <Visibility />
                                                ) : (
                                                    <VisibilityOff />
                                                )}
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
                                className={isAdmin ? "" : "logIn"}
                                classes={{ root: styles.logButton }}
                            >
                                {loading ? (
                                    <CircularProgress
                                        size={20}
                                        color="inherit"
                                    />
                                ) : isAdmin ? (
                                    "Log out"
                                ) : (
                                    "Log in"
                                )}
                            </Button>
                        </Grid>
                    </Grid>
                    {!!loggedInMessage && (
                        <Grid container spacing={2} justify="center">
                            <Grid item>{loggedInMessage}</Grid>
                        </Grid>
                    )}
                </form>
            </div>
        </PageContainer>
    );
}

const mapStateToProps = (state) => ({
    isAdmin: state.appState.isAdmin,
});

const mapDispatchToProps = (dispatch) => ({
    setAdmin: (isAdmin) => dispatch(setAdmin(isAdmin)),
    setSnackbarState: (snackbarState) =>
        dispatch(setSnackbarState(snackbarState)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
