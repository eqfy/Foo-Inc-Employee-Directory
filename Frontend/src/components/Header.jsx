import { Link } from "react-router-dom";
import React from "react";
import { AppBar, Tabs, Tab, Toolbar, makeStyles } from "@material-ui/core";
import logo from "./../assets/ae_logo.png";
import "./Header.css";

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
                            to="/search"
                        />
                        <Tab
                            label="Profile View"
                            classes={{ root: classes.tab }}
                            component={Link}
                            to="/profile"
                        />
                        <Tab
                            label="Organization Chart"
                            classes={{ root: classes.tab }}
                            component={Link}
                            to="/orgChart"
                        />
                        <Tab
                            label="Dashboard (redux demo)"
                            classes={{ root: classes.tab }}
                            component={Link}
                            to="/"
                        />
                    </Tabs>
                </Toolbar>
            </AppBar>
        </div>
    );
}

export default Header;
