import { Link } from "react-router-dom";
import { connect } from "react-redux";
import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Toolbar from "@material-ui/core/Toolbar";
import makeStyles from "@material-ui/styles/makeStyles";
import Avatar from "@material-ui/core/Avatar";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import logo from "./../assets/ae_logo.png";
import "./Header.css";
import { useLocation } from "react-router";
import { PagePathEnum } from "./common/constants";
import { PageTabIndexEnum } from "states/appState";

const useStyles = makeStyles({
    tabIndicator: {
        backgroundColor: "black",
    },
    tab: {
        color: "black",
        textTransform: "none",
        fontSize: "20px",
    },
    myProfile: {
        color: "black",
        textTransform: "none",
        fontSize: "16px",
        alignItems: "flex-start",
        minWidth: 0,
    },
    myProfileImg: {
        height: "40px",
        marginTop: 0,
        marginBottom: 0,
    },
    myProfileMenuItem: {
        textDecoration: "none !important",
    },
});

function Header(props) {
    const { focusedWorkerId, currWorkerId, isAdmin, currWorkerImgURL } = props;
    const [currentTabIndex, setCurrentTabIndex] = React.useState(
        props.activeTabIndex
    );

    const updateTabIndex = (_event, newTabIndex) => {
        setCurrentTabIndex(newTabIndex);
    };

    const { pathname } = useLocation();

    React.useEffect(() => {
        if (pathname.startsWith(PagePathEnum.SEARCH)) {
            setCurrentTabIndex(PageTabIndexEnum.SEARCH);
        } else if (pathname.startsWith(PagePathEnum.PROFILE)) {
            setCurrentTabIndex(PageTabIndexEnum.PROFILE);
        } else if (pathname.startsWith(PagePathEnum.ORGCHART)) {
            setCurrentTabIndex(PageTabIndexEnum.ORGCHART);
        } else if (pathname.startsWith(PagePathEnum.NEWCONTRACTOR)) {
            setCurrentTabIndex(
                isAdmin
                    ? PageTabIndexEnum.NEWCONTRACTOR
                    : PageTabIndexEnum.LOGIN
            );
        } else if (pathname.startsWith(PagePathEnum.UPDATE)) {
            setCurrentTabIndex(PageTabIndexEnum.UPDATE);
        } else if (pathname.startsWith(PagePathEnum.LOGIN)) {
            setCurrentTabIndex(PageTabIndexEnum.LOGIN);
        }
    }, [pathname, currWorkerId, focusedWorkerId, isAdmin]);

    const classes = useStyles();

    const [anchorEl, setAnchorEl] = React.useState(null);
    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handlePopoverClose = (_event) => {
        setAnchorEl(null);
    };
    const handleMyProfileClick = () => {
        setAnchorEl(null);
    };

    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar>
                    <img className="company-logo" src={logo} alt={logo} />
                    <div className="grow"></div>
                    <Tabs
                        value={currentTabIndex}
                        onChange={updateTabIndex}
                        classes={{ indicator: classes.tabIndicator }}
                    >
                        <Tab
                            label="Search Home"
                            classes={{ root: classes.tab }}
                            component={Link}
                            to={PagePathEnum.SEARCH}
                        />
                        <Tab
                            label="Profile View"
                            classes={{ root: classes.tab }}
                            component={Link}
                            to={`${PagePathEnum.PROFILE}/${focusedWorkerId}`}
                        />
                        <Tab
                            label="Organization Chart"
                            classes={{ root: classes.tab }}
                            component={Link}
                            to={`${PagePathEnum.ORGCHART}/${focusedWorkerId}`}
                        />
                        <Tab
                            label="Add Contractor"
                            classes={{ root: classes.tab }}
                            component={Link}
                            to={`${PagePathEnum.NEWCONTRACTOR}`}
                        />
                        <Tab
                            label="Update Note"
                            classes={{ root: classes.tab }}
                            component={Link}
                            to={`${PagePathEnum.UPDATE}`}
                        />
                        <Tab
                            classes={{ root: classes.myProfile }}
                            icon={
                                <Avatar
                                    src={
                                        currWorkerImgURL ||
                                        "/workerPlaceholder.png"
                                    }
                                    alt={"workerPhoto"}
                                />
                            }
                            onClick={handlePopoverOpen}
                            aria-controls="user-menu"
                            aria-haspopup="true"
                        />
                    </Tabs>
                    <Menu
                        id="user-menu"
                        anchorEl={anchorEl}
                        getContentAnchorEl={null}
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "center",
                        }}
                        transformOrigin={{
                            vertical: "top",
                            horizontal: "center",
                        }}
                        disableRestoreFocus
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handlePopoverClose}
                    >
                        <MenuItem
                            classes={{ root: classes.myProfileMenuItem }}
                            component={Link}
                            to={`${PagePathEnum.MYPROFILE}/${currWorkerId}`}
                            onClick={handleMyProfileClick}
                        >
                            My profile
                        </MenuItem>
                        <MenuItem
                            classes={{ root: classes.myProfileMenuItem }}
                            component={Link}
                            to={PagePathEnum.LOGIN}
                            onClick={handlePopoverClose}
                        >
                            Login as admin
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>
        </div>
    );
}

const mapStateToProps = (state) => {
    const {
        appState: { focusedWorkerId, currWorkerId, isAdmin },
        workers: { byId },
    } = state;
    const currWorker = byId[currWorkerId] || {};
    return {
        focusedWorkerId,
        currWorkerId,
        isAdmin,
        currWorkerImgURL: currWorker.image || "",
    };
};

export default connect(mapStateToProps)(Header);
