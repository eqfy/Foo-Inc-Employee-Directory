import TextField from "@material-ui/core/TextField";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import PlayCircleFilledWhiteIcon from "@material-ui/icons/PlayCircleFilledWhite";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { connect } from "react-redux";
import { withRouter, useHistory, useParams } from "react-router";
import OrganizationChart from "@dabeng/react-orgchart";
import "./OrgChart.css";
import React, { useEffect } from "react";
import {
    setOrgChart,
    setOrgChartCenter,
    setOrgChartZoomRatio,
} from "../../actions/orgChartAction";
import WorkerNotFound from "components/common/WorkerNotFound";
import { getPredictiveSearchAPI } from "../../api/predictiveSearchAPI";
import { PagePathEnum } from "components/common/constants";
import { coordinatedDebounce } from "components/searchPage/helpers";
import { parseFullName } from "parse-full-name";
import { HelpButton } from "components/common/HelpButton";

const useStyles = makeStyles({
    searchRect: {
        minWidth: 284,
    },
    card: {
        borderRadius: 20,
        borderWidth: 4,
        borderColor: "black",
        "&.current": {
            borderColor: "#00569C",
            "&:hover, &.nodeSelected": {
                boxShadow: "0 0 3px 3px #004680",
            },
        },
        "&.contractor:not(.current)": {
            borderColor: "#FF9900",
            "&:hover, &.nodeSelected": {
                boxShadow: "0 0 3px 3px #CC7A00",
            },
        },
        "&:hover": {
            cursor: "pointer",
            boxShadow: "0 0 3px 3px black",
        },
        "&.nodeSelected": {
            boxShadow: "0 0 3px 3px black",
        },
        display: "flex",
    },
    cardContent: {
        "&:last-child": {
            padding: 8,
        },
        width: 150,
        paddingLeft: "auto",
        paddingRight: "auto",
    },
    cardMedia: {
        minWidth: 80,
        minHeight: 80,
        margin: 5,
        borderRadius: 13,
    },
    cardText: {
        textAlign: "left",
        textOverflow: "ellipsis",
        overflow: "hidden",
        whiteSpace: "nowrap",
        ".nodeSelected &:hover": {
            cursor: "text",
        },
    },
    loading: {
        color: "#00569c",
        marginLeft: "auto",
        marginRight: "auto",
    },
});

// counter for timeout in case of input change
const predictiveSearchTimer = {};

function OrgChartSearchBar(props) {
    const history = useHistory();
    const classes = useStyles();
    const [options, setOptions] = React.useState([]);
    const [inputValue, setInputValue] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        if (inputValue.length >= 2) {
            coordinatedDebounce((name) => {
                const { first, last } = parseFullName(name);
                setLoading(true);
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
                    })
                    .finally(() => {
                        setLoading(false);
                    });
            }, predictiveSearchTimer)(inputValue);
        }
    }, [inputValue]);

    const handleTextfieldChange = (value, reason) => {
        if (reason === "input") {
            setInputValue(value);
        } else if (reason === "clear" || (reason === "reset" && value === "")) {
            setInputValue("");
        }
    };

    return (
        <Autocomplete
            options={loading ? ["loading"] : options}
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
            renderOption={(option) =>
                loading ? (
                    <div className={"search-dropdown-entry"}>
                        <CircularProgress
                            size={"20px"}
                            classes={{ root: classes.loading }}
                        />
                    </div>
                ) : (
                    <div
                        className={"search-dropdown-entry"}
                        onClick={() => {
                            setInputValue(
                                option.firstName + " " + option.lastName
                            );
                            history.push(
                                `${PagePathEnum.ORGCHART}/` +
                                    option.employeeNumber
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
                )
            }
            inputValue={inputValue}
            onInputChange={(_event, value, reason) => {
                handleTextfieldChange(value, reason);
            }}
        />
    );
}

function OrgChartNode(props) {
    const classes = useStyles();
    const history = useHistory();

    const {
        nodeData,
        selectedIdOnChart,
        setSelectedIdOnChart,
        hideTop,
        setHideTop,
        hideBottom,
        setHideBottom,
    } = props;

    // Add classes to display full text in a floating div if name/title is too long
    useEffect(() => {
        const nameText = document.getElementsByClassName(
            `card-name-${nodeData.id}`
        )[0];
        if (nameText.clientWidth < nameText.scrollWidth) {
            nameText.classList.add("card-text-too-long");
        }

        const titleText = document.getElementsByClassName(
            `card-title-${nodeData.id}`
        )[0];
        if (titleText.clientWidth < titleText.scrollWidth) {
            titleText.classList.add("card-text-too-long");
        }

        const emailText = document.getElementsByClassName(
            `card-email-${nodeData.id}`
        )[0];
        if (emailText.clientWidth < emailText.scrollWidth) {
            emailText.classList.add("card-text-too-long");
        }
    }, [nodeData.id]);

    const card = (
        <Card
            variant="outlined"
            className={`${nodeData.isCurrent ? "current" : ""} ${
                nodeData.isContractor ? "contractor" : ""
            } ${nodeData.id === selectedIdOnChart ? "nodeSelected" : ""}`}
            classes={{ root: classes.card }}
            onClick={(e) => {
                setSelectedIdOnChart(nodeData.id);
                e.stopPropagation();
            }}
            onMouseDown={(e) => {
                e.stopPropagation();
            }}
            onDoubleClick={() => {
                setHideTop(false);
                setHideBottom(false);
                setSelectedIdOnChart("");
                if (!nodeData.isCurrent) {
                    history.push(`${PagePathEnum.ORGCHART}/` + nodeData.id);
                }
            }}
        >
            <CardMedia
                image={nodeData.image || "/workerPlaceholder.png"}
                classes={{ root: classes.cardMedia }}
            />
            <CardContent classes={{ root: classes.cardContent }}>
                <Typography
                    classes={{ root: classes.cardText }}
                    className={`card-name-${nodeData.id}`}
                >
                    <b>{nodeData.name}</b>
                </Typography>
                <Typography className={"card-name-extension"}>
                    <b>{nodeData.name}</b>
                </Typography>
                <Typography
                    classes={{ root: classes.cardText }}
                    className={`card-title-${nodeData.id}`}
                >
                    {nodeData.title}
                </Typography>
                <Typography className={"card-title-extension"}>
                    {nodeData.title}
                </Typography>
                <Typography
                    classes={{ root: classes.cardText }}
                    className={`card-email-${nodeData.id}`}
                >
                    {nodeData.email}
                </Typography>
                <Typography className={"card-email-extension"}>
                    {nodeData.email}
                </Typography>
            </CardContent>
        </Card>
    );

    if (nodeData.isCurrent) {
        return (
            <div>
                <div
                    className={`node-expander-top ${
                        hideTop ? "arrow-up" : "arrow-down"
                    }`}
                    onClick={(e) => {
                        setHideTop(!hideTop);
                        e.stopPropagation();
                    }}
                    onMouseDown={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <PlayCircleFilledWhiteIcon />
                </div>
                {card}
                <div
                    className={`node-expander-bottom ${
                        hideBottom ? "arrow-down" : "arrow-up"
                    }`}
                    onClick={(e) => {
                        setHideBottom(!hideBottom);
                        e.stopPropagation();
                    }}
                    onMouseDown={(e) => {
                        e.stopPropagation();
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

const getTransform = (zoom, centerX, centerY) =>
    `matrix(${zoom}, 0, 0, ${zoom}, ${centerX}, ${centerY})`;

let orgChartMouseDown = false;

function OrgChart(props) {
    const {
        dataSetMinimum,
        dataSetHideTop,
        dataSetHideBottom,
        dataSetDefault,
        centerWorkerId,
        ready,
        zoom,
        centerX,
        centerY,
        setOrgChart,
        setOrgChartZoomRatio,
        setOrgChartCenter,
    } = props;
    const classes = useStyles();

    const [hideTop, setHideTop] = React.useState(false);
    const [hideBottom, setHideBottom] = React.useState(false);

    const [selectedIdOnChart, setSelectedIdOnChart] = React.useState("");

    const params = useParams();

    useEffect(() => {
        if (centerWorkerId !== params["workerId"]) {
            // reset center and ratio
            setOrgChartZoomRatio(0.7);
            setOrgChartCenter(0, 0);
            setOrgChart(params["workerId"]);
        }

        orgChartMouseDown = false;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params]);

    let dataSet;

    if (hideTop) {
        if (hideBottom) {
            dataSet = dataSetMinimum;
        } else {
            dataSet = dataSetHideTop;
        }
    } else {
        if (hideBottom) {
            dataSet = dataSetHideBottom;
        } else {
            dataSet = dataSetDefault;
        }
    }

    const chartArea = !ready ? (
        // loading state
        <div className={"orgchart-container"}>
            <CircularProgress
                size={"100px"}
                classes={{ root: classes.loading }}
                data-cy="loading-orgchart"
            />
        </div>
    ) : props.dataSetDefault === undefined ? (
        // invalid state
        <div className={"orgchart-container"}>
            <WorkerNotFound />
        </div>
    ) : (
        // chart state
        <div
            className="chart-area-container"
            onMouseUp={(e) => {
                orgChartMouseDown = false;
            }}
            onMouseMove={(e) => {
                if (orgChartMouseDown) {
                    setOrgChartCenter(
                        centerX + e.movementX,
                        centerY + e.movementY
                    );
                }
            }}
            onMouseDown={(e) => {
                orgChartMouseDown = true;
            }}
            onClick={(e) => {
                setSelectedIdOnChart("");
            }}
            onWheel={(e) => {
                const deltaY = e.deltaY;
                let ratio = zoom;

                if (deltaY > 0) {
                    ratio /= 1.2;
                    if (ratio < 0.2) {
                        ratio = 0.2;
                    }
                } else if (deltaY < 0) {
                    ratio *= 1.2;
                    if (ratio > 1) {
                        ratio = 1;
                    }
                }

                setOrgChartZoomRatio(ratio);
            }}
        >
            <div id="chartAreaCenteredReference"></div>
            <CustomizedOrganizationChart
                dataSource={dataSet}
                nodeTemplate={(nodeData) =>
                    OrgChartNode({
                        ...nodeData,
                        selectedIdOnChart: selectedIdOnChart,
                        setSelectedIdOnChart: setSelectedIdOnChart,
                        hideTop: hideTop,
                        setHideTop: setHideTop,
                        hideBottom: hideBottom,
                        setHideBottom: setHideBottom,
                    })
                }
                setSelectedIdOnChart={setSelectedIdOnChart}
                zoom={zoom}
                centerX={centerX}
                centerY={centerY}
            />
        </div>
    );
    return (
        <div>
            <div id="searchLegendArea">
                <div id="searchArea">
                    <OrgChartSearchBar />
                </div>
                <ul id="legend">
                    <li>
                        LEGEND
                        <HelpButton className={"org-chart-help-button"}>
                            <ol style={{ maxWidth: 600 }}>
                                <li>
                                    You could drag the chart using the cursor or
                                    zoom through scrolling.
                                </li>
                                <li>
                                    To hide supervisor and colleagues, or
                                    subordinates, toggle the show or hide
                                    buttons.
                                </li>
                                <li>
                                    To see the full text of the name, title or
                                    email of an employee/contractor, click once
                                    on a card.
                                </li>
                                <li>
                                    To see an organization chart for a different
                                    employee/contractor in the current chart,
                                    click twice on a card.
                                </li>
                                <li>
                                    To find an employee/contractor by name and
                                    see an organization chart for the selected
                                    employee/contractor, use the “Search by
                                    name” bar.
                                </li>
                                <li>
                                    To see the full profile of an
                                    employee/contractor, navigate to "Profile
                                    View".
                                </li>
                            </ol>
                        </HelpButton>
                    </li>
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

function CustomizedOrganizationChart(props) {
    const { dataSource, nodeTemplate, zoom, centerX, centerY } = props;

    useEffect(() => {
        const orgchart = document.getElementsByClassName("orgchart")[0];

        if (orgchart) {
            orgchart["style"].transform = getTransform(zoom, centerX, centerY);
        }
    }, [zoom, centerX, centerY]);

    return (
        <OrganizationChart
            datasource={dataSource}
            collapsible={false}
            zoom={false}
            zoomInLimit={0.7}
            zoomOutLimit={0.7}
            pan={false}
            NodeTemplate={nodeTemplate}
        />
    );
}

const mapStateToProps = (state) => {
    let dataSetDefault = undefined;
    let dataSetHideTop = undefined;
    let dataSetHideBottom = undefined;
    let dataSetMinimum = undefined;

    // loaded and valid id (excluding zoom)
    if (state.appState.ready && state.orgChartState.colleagues) {
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
                email: worker.email,
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
        centerWorkerId: state.orgChartState.centerWorkerId,
        zoom: state.orgChartState.zoom,
        centerX: state.orgChartState.centerX,
        centerY: state.orgChartState.centerY,
        ready: state.appState.ready,
    };
};

const mapDispatchToProps = (dispatch) => ({
    setOrgChart: (workerId) => dispatch(setOrgChart(workerId)),
    setOrgChartZoomRatio: (zoom) => dispatch(setOrgChartZoomRatio(zoom)),
    setOrgChartCenter: (centerX, centerY) =>
        dispatch(setOrgChartCenter(centerX, centerY)),
});

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(OrgChart)
);
