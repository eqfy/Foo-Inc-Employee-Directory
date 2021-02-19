import {
    TextField,
    Button,
    makeStyles,
    Card,
    CardMedia,
    CardContent,
    Typography,
} from "@material-ui/core";
import OrganizationChart from "@dabeng/react-orgchart";
import "./OrgChart.css";
import React from "react";
import dataset from "./../../mocks/mockOrgChart.json";

const useStyles = makeStyles({
    searchRect: {
        minWidth: 300,
    },
    searchButton: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 5,
        paddingbottom: 5,
        backgroundColor: "#00569C",
        color: "#FFFFFF",
        "&:hover": {
            backgroundColor: "#004680",
        },
    },
    card: {
        borderRadius: 20,
        borderWidth: 4,
        borderColor: "black",
        "&.current": {
            borderColor: "#00569C",
        },
        "&.contractor": {
            borderColor: "#FF9900",
        },
        "&:hover": {
            cursor: "pointer",
        },
        display: "flex",
    },
    cardContent: {
        "&:last-child": {
            padding: 20,
            flex: "1 0 auto",
        },
    },
    cardMedia: {
        padding: 20,
        width: 50,
    },
});

function OrgChartNode(props) {
    const classes = useStyles();

    const data = props.nodeData;

    return (
        <Card
            variant="outlined"
            className={`${data.isCurrent ? "current" : ""} ${
                data.isContractor ? "contractor" : ""
            }`}
            classes={{ root: classes.card }}
        >
            <CardMedia
                image="sample.png"
                classes={{ root: classes.cardMedia }}
            />
            <CardContent classes={{ root: classes.cardContent }}>
                <Typography>{data.name}</Typography>
                <Typography>{data.division}</Typography>
            </CardContent>
        </Card>
    );
}

function OrgChart(props) {
    const classes = useStyles();

    return (
        <div>
            <div id="searchLegendArea">
                <form id="searchArea">
                    <TextField
                        label="Employee name"
                        variant="outlined"
                        classes={{ root: classes.searchRect }}
                    />
                    <Button
                        variant="contained"
                        classes={{ root: classes.searchButton }}
                    >
                        Search
                    </Button>
                </form>
                <ul id="legend">
                    <li>LEGEND</li>
                    <li>
                        <div className={"dark-blue-background"}></div>Current
                        Search
                    </li>
                    <li>
                        <div className={"orange-background"}></div>Contractor
                    </li>
                </ul>
            </div>
            <OrganizationChart
                datasource={dataset}
                collapsible={false}
                zoominLimit={7}
                NodeTemplate={OrgChartNode}
            />
        </div>
    );
}

export default OrgChart;
