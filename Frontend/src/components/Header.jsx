import { Link } from "react-router-dom";
import { connect } from "react-redux";
import React from "react";
import {
    AppBar,
    Tabs,
    Tab,
    Toolbar,
    makeStyles,
    Avatar,
    Menu,
    MenuItem,
} from "@material-ui/core";
import logo from "./../assets/ae_logo.png";
import "./Header.css";
import { useLocation } from "react-router";
import { PagePathEnum } from "./common/constants";

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
            setCurrentTabIndex(0);
        } else if (pathname.startsWith(PagePathEnum.PROFILE)) {
            setCurrentTabIndex(1);
        } else if (pathname.startsWith(PagePathEnum.ORGCHART)) {
            setCurrentTabIndex(2);
        } else if (pathname.startsWith(PagePathEnum.NEWCONTRACTOR)) {
            setCurrentTabIndex(isAdmin ? 3 : 5);
        } else if (pathname.startsWith(PagePathEnum.UPDATE)) {
            setCurrentTabIndex(4);
        } else if (pathname.startsWith(PagePathEnum.LOGIN)) {
            setCurrentTabIndex(5);
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
        setCurrentTabIndex(1);
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
                            to={`${PagePathEnum.PROFILE}/${currWorkerId}`}
                            onClick={handleMyProfileClick}
                        >
                            My Profile
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
