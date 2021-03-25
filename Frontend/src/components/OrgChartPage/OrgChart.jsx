import {
    TextField,
    makeStyles,
    Card,
    CardMedia,
    CardContent,
    Typography,
    CircularProgress,
} from "@material-ui/core";
import PlayCircleFilledWhiteIcon from "@material-ui/icons/PlayCircleFilledWhite";
import { Autocomplete } from "@material-ui/lab";
import { connect } from "react-redux";
import { withRouter, useHistory, useParams } from "react-router";
import OrganizationChart from "@dabeng/react-orgchart";
import "./OrgChart.css";
import React, { useEffect } from "react";
import { setOrgChart } from "../../actions/orgChartAction";
import WorkerNotFound from "components/common/WorkerNotFound";
import { getPredictiveSearchAPI } from "../../api/predictiveSearchAPI";
import { PagePathEnum } from "components/common/constants";
import { coordinatedDebounce } from "components/searchPage/helpers";
import { parseFullName } from "parse-full-name";

const useStyles = makeStyles({
    searchRect: {
        minWidth: 300,
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
        },
        width: 150,
        paddingLeft: "auto",
        paddingRight: "auto",
    },
    cardMedia: {
        minWidth: 80,
        minHeight: 80,
        margin: 5,
    },
    cardText: {
        textAlign: "left",
        textOverflow: "ellipsis",
        overflow: "hidden",
        whiteSpace: "nowrap",
    },
    loading: {
        color: "#00569c",
    },
});

// counter for timeout in case of input change
const predictiveSearchTimer = {};

function OrgChartSearchBar(props) {
    const history = useHistory();
    const classes = useStyles();
    const [options, setOptions] = React.useState([]);
    const [inputValue, setInputValue] = React.useState("");

    React.useEffect(() => {
        if (inputValue.length >= 2) {
            coordinatedDebounce((name) => {
                const { first, last } = parseFullName(name);
                getPredictiveSearchAPI(first, last)
                    .then((response) => {
                        setOptions(response);
                    })
                    .catch((err) => {
                        console.error(
                            "Org chart predictive search endpoint failed: ",
                            err
                        );
                        setOptions([]);
                    });
            }, predictiveSearchTimer)(inputValue);
        }
    }, [inputValue]);

    const handleTextfieldChange = (value, reason) => {
        if (reason === "input") {
            setInputValue(value);
        } else if (reason === "clear") {
            setInputValue("");
        }
    };

    return (
        <Autocomplete
            options={options}
            getOptionLabel={() => inputValue}
            openOnFocus={true}
            freeSolo={true}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="outlined"
                    label="Search by name"
                    classes={{ root: classes.searchRect }}
                    size="small"
                />
            )}
            renderOption={(option) => (
                <div
                    className={"orgchart-search-dropdown-entry"}
                    onClick={() => {
                        history.push(
                            `${PagePathEnum.ORGCHART}/` + option.employeeNumber
                        );
                    }}
                >
                    <img
                        src={option.imageURL || "/workerPlaceholder.png"}
                        alt={"workerPhoto"}
                    />
                    <Typography noWrap>
                        {`${option.firstName} ${option.lastName}`}
                    </Typography>
                </div>
            )}
            inputValue={inputValue}
            onInputChange={(_event, value, reason) => {
                handleTextfieldChange(value, reason);
            }}
        />
    );
}

let setHideTop;
let setHideBottom;
let orgChartHideTop = false;
let orgChartHideBottom = false;

function OrgChartNode(props) {
    const classes = useStyles();
    const history = useHistory();

    const data = props.nodeData;

    // Add classes to display full text in a floating div if name/title is too long
    useEffect(() => {
        const nameText = document.getElementsByClassName(
            `card-name-${data.id}`
        )[0];
        if (nameText.clientWidth < nameText.scrollWidth) {
            nameText.classList.add("card-text-too-long");
        }

        const titleText = document.getElementsByClassName(
            `card-title-${data.id}`
        )[0];
        if (titleText.clientWidth < titleText.scrollWidth) {
            titleText.classList.add("card-text-too-long");
        }
    }, [data.id]);

    const card = (
        <Card
            variant="outlined"
            className={`${data.isCurrent ? "current" : ""} ${
                data.isContractor ? "contractor" : ""
            }`}
            classes={{ root: classes.card }}
            onClick={() => {
                setHideTop(false);
                setHideBottom(false);
                if (!data.isCurrent) {
                    history.push(`${PagePathEnum.ORGCHART}/` + data.id);
                }
            }}
        >
            <CardMedia
                image={data.image || "/workerPlaceholder.png"}
                classes={{ root: classes.cardMedia }}
            />
            <CardContent classes={{ root: classes.cardContent }}>
                <Typography
                    classes={{ root: classes.cardText }}
                    className={`card-name-${data.id}`}
                >
                    {data.name}
                </Typography>
                <Typography className={"card-name-extension"}>
                    {data.name}
                </Typography>
                <Typography
                    classes={{ root: classes.cardText }}
                    className={`card-title-${data.id}`}
                >
                    {data.title}
                </Typography>
                <Typography className={"card-title-extension"}>
                    {data.title}
                </Typography>
            </CardContent>
        </Card>
    );

    if (data.isCurrent) {
        return (
            <div>
                <div
                    className={`node-expander-top ${
                        orgChartHideTop ? "arrow-up" : "arrow-down"
                    }`}
                    onClick={() => {
                        setHideTop(!orgChartHideTop);
                    }}
                >
                    <PlayCircleFilledWhiteIcon />
                </div>
                {card}
                <div
                    className={`node-expander-bottom ${
                        orgChartHideBottom ? "arrow-down" : "arrow-up"
                    }`}
                    onClick={() => {
                        setHideBottom(!orgChartHideBottom);
                    }}
                >
                    <PlayCircleFilledWhiteIcon />
                </div>
            </div>
        );
    } else {
        return card;
    }
}

function OrgChart(props) {
    const classes = useStyles();

    const [hideTop, reactSetHideTop] = React.useState(false);
    const [hideBottom, reactSetHideBottom] = React.useState(false);

    const params = useParams();

    setHideTop = (hide) => {
        orgChartHideTop = hide;
        reactSetHideTop(orgChartHideTop);
    };

    setHideTop = setHideTop.bind(this);

    setHideBottom = (hide) => {
        orgChartHideBottom = hide;
        reactSetHideBottom(orgChartHideBottom);
    };

    setHideBottom = setHideBottom.bind(this);

    useEffect(() => {
        props.setOrgChart(params["workerId"]);
    }, [params]);

    let dataSet;

    if (hideTop) {
        if (hideBottom) {
            dataSet = props.dataSetMinimum;
        } else {
            dataSet = props.dataSetHideTop;
        }
    } else {
        if (hideBottom) {
            dataSet = props.dataSetHideBottom;
        } else {
            dataSet = props.dataSetDefault;
        }
    }

    const chartArea = !props.ready ? (
        // loading state
        <div className={"orgchart-container"}>
            <CircularProgress
                size={"100px"}
                classes={{ root: classes.loading }}
            />
        </div>
    ) : props.dataSetDefault === undefined ? (
        // invalid state
        <div className={"orgchart-container"}>
            <WorkerNotFound />
        </div>
    ) : (
        // chart state
        <OrganizationChart
            datasource={dataSet}
            collapsible={false}
            zoom={true}
            pan={true}
            zoominLimit={1}
            zoomoutLimit={0.4}
            NodeTemplate={OrgChartNode}
        />
    );

    return (
        <div>
            <div id="searchLegendArea">
                <div id="searchArea">
                    <OrgChartSearchBar />
                </div>
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
            {chartArea}
        </div>
    );
}

const mapStateToProps = (state) => {
    let dataSetDefault = undefined;
    let dataSetHideTop = undefined;
    let dataSetHideBottom = undefined;
    let dataSetMinimum = undefined;

    // loaded and valid id
    if (state.appState.ready && Object.keys(state.orgChartState).length > 0) {
        const orgChartState = state.orgChartState;
        const workers = state.workers;
        const focusedWorkerId = state.appState.focusedWorkerId;

        const convertWorkerToNode = (workerId) => {
            const worker = workers.byId[workerId];
            return {
                id: workerId,
                name: worker.firstName + " " + worker.lastName,
                title: worker.title,
                isCurrent: workerId === focusedWorkerId,
                isContractor: worker.isContractor,
                image: worker.image,
            };
        };

        const listNodeReducer = (list, currentElement) => {
            list.push(convertWorkerToNode(currentElement));
            return list;
        };

        const copy = (obj) => JSON.parse(JSON.stringify(obj));

        if (orgChartState.supervisor === undefined) {
            // there is no supervisor for current employee
            dataSetDefault = convertWorkerToNode(focusedWorkerId);
            dataSetHideBottom = copy(dataSetDefault);
            dataSetMinimum = copy(dataSetDefault);
            dataSetDefault.children = orgChartState.subordinates.reduce(
                listNodeReducer,
                []
            );

            dataSetHideTop = copy(dataSetDefault);
        } else {
            // there is supervisor for current employee

            const supervisorNode = convertWorkerToNode(
                orgChartState.supervisor
            );
            const colleagueNodes = orgChartState.colleagues.reduce(
                listNodeReducer,
                []
            );
            const subordinateNodes = orgChartState.subordinates.reduce(
                listNodeReducer,
                []
            );

            dataSetDefault = supervisorNode;
            dataSetDefault.children = colleagueNodes;
            dataSetHideBottom = copy(dataSetDefault);

            for (const colleague of dataSetDefault.children) {
                if (colleague.id === focusedWorkerId) {
                    colleague.children = subordinateNodes;
                    break;
                }
            }

            dataSetMinimum = convertWorkerToNode(focusedWorkerId);

            dataSetHideTop = copy(dataSetMinimum);
            dataSetHideTop.children = subordinateNodes;
        }
    }

    return {
        dataSetDefault: dataSetDefault,
        dataSetHideTop: dataSetHideTop,
        dataSetHideBottom: dataSetHideBottom,
        dataSetMinimum: dataSetMinimum,
        focusedWorkerId: state.appState.focusedWorkerId,
        ready: state.appState.ready,
    };
};

const mapDispatchToProps = (dispatch) => ({
    setOrgChart: (workerId) => dispatch(setOrgChart(workerId)),
});

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(OrgChart)
);
