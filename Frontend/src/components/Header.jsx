import { Link } from "react-router-dom";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import React from "react";
import {
    AppBar,
    Tabs,
    Tab,
    Toolbar,
    makeStyles,
    Avatar,
    Popover,
} from "@material-ui/core";
import logo from "./../assets/ae_logo.png";
import "./Header.css";
import { useLocation } from "react-router";
import { PagePathEnum } from "./common/constants";
import { setFocusedWorkerId } from "actions/generalAction";

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
    myProfilePopover: {
        pointerEvents: "none",
    },
});

function Header(props) {
    const {
        focusedWorkerId,
        currWorkerId,
        currWorkerImgURL,
        currWorkerName,
        setFocusedWorkerId,
    } = props;
    const [currentTabIndex, setCurrentTabIndex] = React.useState(
        props.activeTabIndex
    );

    const updateTabIndex = (event, newTabIndex) => {
        if (newTabIndex === 5) {
            setCurrentTabIndex(1);
            setFocusedWorkerId(currWorkerId);
        } else {
            setCurrentTabIndex(newTabIndex);
        }
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
            setCurrentTabIndex(3);
        } else if (pathname.startsWith(PagePathEnum.UPDATE)) {
            setCurrentTabIndex(4);
        }
    }, [pathname, currWorkerId, focusedWorkerId]);

    const classes = useStyles();

    const [anchorEl, setAnchorEl] = React.useState(null);
    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = (event) => {
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
                            component={Link}
                            to={`${PagePathEnum.PROFILE}/${currWorkerId}`}
                            onMouseEnter={handlePopoverOpen}
                            onMouseLeave={handlePopoverClose}
                        />
                    </Tabs>
                    <Popover
                        anchorEl={anchorEl}
                        classes={{ root: classes.myProfilePopover }}
                        open={Boolean(anchorEl)}
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "center",
                        }}
                        transformOrigin={{
                            vertical: "top",
                            horizontal: "center",
                        }}
                        disableRestoreFocus
                    >
                        <div className="popover-content">{"My profile"}</div>
                    </Popover>
                </Toolbar>
            </AppBar>
        </div>
    );
}

const mapStateToProps = (state) => {
    const {
        appState: { focusedWorkerId, currWorkerId },
        workers: { byId },
    } = state;
    const currWorker = byId[currWorkerId] || {};
    return {
        focusedWorkerId,
        currWorkerId,
        currWorkerImgURL: currWorker.image || "",
        currWorkerName: currWorker.firstName,
    };
};

const mapDispatchToProps = (dispatch) => ({
    setFocusedWorkerId: (workerId) => dispatch(setFocusedWorkerId(workerId)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
