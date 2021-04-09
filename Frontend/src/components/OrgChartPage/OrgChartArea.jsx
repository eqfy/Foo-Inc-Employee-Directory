import makeStyles from "@material-ui/core/styles/makeStyles";
import CircularProgress from "@material-ui/core/CircularProgress";
import { connect } from "react-redux";
import { useParams } from "react-router";
import OrganizationChart from "@dabeng/react-orgchart";
import "./OrgChart.css";
import React, { useEffect } from "react";
import { setOrgChart } from "../../actions/orgChartAction";
import WorkerNotFound from "components/common/WorkerNotFound";
import OrgChartNode from "./OrgChartNode";

const useStyles = makeStyles({
    loading: {
        color: "#00569c",
        marginLeft: "auto",
        marginRight: "auto",
    },
});

const getTransform = (zoom, centerX, centerY) =>
    `matrix(${zoom}, 0, 0, ${zoom}, ${centerX}, ${centerY})`;

let orgChartMouseDown = false;

function OrgChartArea(props) {
    const {
        dataSetMinimum,
        dataSetHideTop,
        dataSetHideBottom,
        dataSetDefault,
        centerWorkerId,
        ready,
        setOrgChart,
    } = props;
    const classes = useStyles();

    const [hideTop, setHideTop] = React.useState(false);
    const [hideBottom, setHideBottom] = React.useState(false);

    const [zoom, setZoom] = React.useState(0.7);
    const [center, setCenter] = React.useState({
        x: 0,
        y: 0,
    });

    const params = useParams();

    useEffect(() => {
        if (centerWorkerId !== params["workerId"]) {
            // reset center and ratio
            setZoom(0.7);
            setCenter({
                x: 0,
                y: 0,
            });
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

    return (
        <div className="chart-area-container">
            {!ready ? (
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
                    className="chart-area-container loaded-chart"
                    onMouseUp={(e) => {
                        orgChartMouseDown = false;
                    }}
                    onMouseMove={(e) => {
                        if (orgChartMouseDown) {
                            setCenter({
                                x: center.x + e.movementX,
                                y: center.y + e.movementY,
                            });
                        }
                    }}
                    onMouseDown={(e) => {
                        orgChartMouseDown = true;
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

                        setZoom(ratio);
                    }}
                >
                    <CustomizedOrganizationChart
                        dataSource={dataSet}
                        nodeTemplate={({ nodeData }) => (
                            <OrgChartNode
                                nodeData={nodeData}
                                hideTop={hideTop}
                                setHideTop={setHideTop}
                                hideBottom={hideBottom}
                                setHideBottom={setHideBottom}
                            />
                        )}
                        zoom={zoom}
                        centerX={center.x}
                        centerY={center.y}
                        ready={ready}
                    />
                </div>
            )}
        </div>
    );
}

function CustomizedOrganizationChart(props) {
    const { dataSource, nodeTemplate, zoom, centerX, centerY, ready } = props;

    const [hidden, setHidden] = React.useState(true);

    useEffect(() => {
        if (ready) {
            const orgChart = document.getElementsByClassName("orgchart")[0];

            if (orgChart) {
                orgChart["style"].cursor = "move";
            }

            setHidden(false);
        }
    }, [ready]);

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
            chartClass={hidden ? "chart-hidden" : ""}
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
        ready: state.appState.ready,
    };
};

const mapDispatchToProps = (dispatch) => ({
    setOrgChart: (workerId) => dispatch(setOrgChart(workerId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(OrgChartArea);
