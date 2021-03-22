import { Link } from "react-router-dom";
import React from "react";
import { AppBar, Tabs, Tab, Toolbar, makeStyles } from "@material-ui/core";
import logo from "./../assets/ae_logo.png";
import "./Header.css";
import { useLocation } from "react-router";
import { PagePathEnum } from './common/constants';

const useStyles = makeStyles({
    tabIndicator: {
        backgroundColor: "black",
    },
    tab: {
        color: "black",
        textTransform: "none",
        fontSize: "20px",
    },
});

function Header(props) {
    const [currentTabIndex, setCurrentTabIndex] = React.useState(
        props.activeTabIndex
    );

    const updateTabIndex = (event, newTabIndex) => {
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
            setCurrentTabIndex(3);
        } else if (pathname.startsWith(PagePathEnum.UPDATE)) {
            setCurrentTabIndex(4);
        }
    }, [pathname]);

    const classes = useStyles();

    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar>
                    <img src={logo} alt={logo} />
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
                            to={`${PagePathEnum.PROFILE}/10001`}
                        />
                        <Tab
                            label="Organization Chart"
                            classes={{ root: classes.tab }}
                            component={Link}
                            to={`${PagePathEnum.ORGCHART}/10001`}
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
                    </Tabs>
                </Toolbar>
            </AppBar>
        </div>
    );
}

export default Header;
