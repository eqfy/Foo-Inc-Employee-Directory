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
        backgroundColor: "#1c83fb",
        color: "#FFFFFF",
        "&:hover": {
            backgroundColor: "#00569C",
        },
    },
    card: {
        borderRadius: 20,
        borderWidth: 4,
        borderColor: "black",
        "&.current": {
            borderColor: "#00569C",
            "&:hover": {
                boxShadow: "0 0 3px 3px #004680",
            },
        },
        "&.contractor": {
            borderColor: "#FF9900",
            "&:hover": {
                boxShadow: "0 0 3px 3px #CC7A00",
            },
        },
        "&:hover": {
            cursor: "pointer",
            boxShadow: "0 0 3px 3px black",
        },
        display: "flex",
    },
    cardContent: {
        "&:last-child": {
            padding: 20,
            flex: "1 0 auto",
        },
        minWidth: 100,
    },
    cardMedia: {
        padding: 20,
        minWidth: 50,
        minHeight: 50,
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
                image="./../sample.png"
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

    // only used for demo
    const [dataSetIndex, setDataSetIndex] = React.useState(0);

    return (
        <div>
            <div id="searchLegendArea">
                <form id="searchArea">
                    <TextField
                        label="Search by name"
                        variant="outlined"
                        classes={{ root: classes.searchRect }}
                        size="small"
                    />
                    <Button
                        variant="contained"
                        classes={{ root: classes.searchButton }}
                        size="small"
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
                datasource={dataset[dataSetIndex]}
                collapsible={false}
                zoom={false}
                pan={true}
                zoominLimit={1}
                zoomoutLimit={0.4}
                NodeTemplate={OrgChartNode}
                onClickNode={(node) => {
                    if (node.id === 'n2') {
                        if (dataSetIndex === 1) {
                            setDataSetIndex(0);
                        }
                    } else if (node.id === 'n6') {
                        if (dataSetIndex === 0) {
                            setDataSetIndex(1);
                        }
                    }
                }}
            />
        </div>
    );
}

export default OrgChart;
