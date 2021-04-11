import makeStyles from "@material-ui/core/styles/makeStyles";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import PlayCircleFilledWhiteIcon from "@material-ui/icons/PlayCircleFilledWhite";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import { connect } from "react-redux";
import { useHistory } from "react-router";
import "./OrgChart.css";
import React, { useEffect } from "react";
import { PagePathEnum } from "components/common/constants";
import CopyToClipboard from "react-copy-to-clipboard";
import { setSnackbarState } from "actions/generalAction";

const useStyles = makeStyles({
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
        "&.contractor:not(.current)": {
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
    copyButton: {
        color: "#C4C4C4",
        width: 16,
        height: 16,
        transition: "color 0.25s",
        "&:hover": {
            color: "midnightblue",
            cursor: "pointer",
        },
        display: "inline-block",
        marginTop: "auto",
        marginBottom: "auto",
        marginLeft: 5,
    },
    checkIcon: {
        color: "green",
        width: 16,
        height: 16,
        display: "inline-block",
        marginTop: "auto",
        marginBottom: "auto",
        marginLeft: 5,
    },
    textCopyContainer: {
        userSelect: "none",
        display: "flex",
        justifyContent: "left",
        verticalAlign: "middle",
        "& > span": {
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
        },
        "&.textExtension": {
            position: "absolute",
            left: 105,
            zIndex: 30,
            whiteSpace: "nowrap",
            opacity: 0,
            transition: "opacity 0.5s ease",
            textAlign: "center",
            backgroundColor: "white",
            visibility: "hidden",
            ".card-text-too-long + &": {
                visibility: "visible",
                opacity: 0,
                "&:hover": {
                    opacity: 1,
                },
            },
            // name
            "&:nth-child(2)": {
                bottom: 17 + 24 * 2,
            },
            // title
            "&:nth-child(4)": {
                bottom: 17 + 24,
            },
            // email
            "&:nth-child(6)": {
                bottom: 17,
            },
        },
    },
});

function OrgChartNodeText(props) {
    const { type, employeeNumber, content, fullText, setSnackbarState } = props;
    const classes = useStyles();

    return (
        <div
            className={`${classes.textCopyContainer} ${
                fullText ? "textExtension" : ""
            } card-${type}-${employeeNumber}`}
        >
            <Typography variant="body1" color="textPrimary" component="span">
                {type === "name" ? <b>{content}</b> : content}
            </Typography>

            <CopyToClipboard
                text={content}
                onCopy={() => {
                    setSnackbarState({
                        open: true,
                        severity: "success",
                        message: "Successfully copied!",
                    });
                }}
            >
                <FileCopyIcon
                    classes={{ root: classes.copyButton }}
                    onClick={(e) => e.stopPropagation()}
                />
            </CopyToClipboard>
        </div>
    );
}

function OrgChartNode(props) {
    const classes = useStyles();
    const history = useHistory();

    const {
        nodeData,
        hideTop,
        setHideTop,
        hideBottom,
        setHideBottom,
        setSnackbarState,
    } = props;

    // Add classes to display full text in a floating div if name/title is too long
    useEffect(() => {
        const nameContainer = document.getElementsByClassName(
            `card-name-${nodeData.id}`
        )[0];

        const nameText = nameContainer.getElementsByTagName("span")[0];

        if (nameText.clientWidth < nameText.scrollWidth) {
            nameContainer.classList.add("card-text-too-long");
        }

        const titleContainer = document.getElementsByClassName(
            `card-title-${nodeData.id}`
        )[0];
        const titleText = titleContainer.getElementsByTagName("span")[0];

        if (titleText.clientWidth < titleText.scrollWidth) {
            titleContainer.classList.add("card-text-too-long");
        }

        const emailContainer = document.getElementsByClassName(
            `card-email-${nodeData.id}`
        )[0];
        const emailText = emailContainer.getElementsByTagName("span")[0];

        if (emailText.clientWidth < emailText.scrollWidth) {
            emailContainer.classList.add("card-text-too-long");
        }
    }, [nodeData.id]);

    const card = (
        <Card
            variant="outlined"
            className={`${nodeData.isCurrent ? "current" : ""} ${
                nodeData.isContractor ? "contractor" : ""
            }`}
            classes={{ root: classes.card }}
            onClick={() => {
                setHideTop(false);
                setHideBottom(false);
                if (!nodeData.isCurrent) {
                    history.push(`${PagePathEnum.ORGCHART}/` + nodeData.id);
                }
            }}
            onMouseDown={(e) => {
                e.stopPropagation();
            }}
        >
            <CardMedia
                image={nodeData.image || "/workerPlaceholder.png"}
                classes={{ root: classes.cardMedia }}
            />
            <CardContent classes={{ root: classes.cardContent }}>
                <OrgChartNodeText
                    type="name"
                    employeeNumber={nodeData.id}
                    content={nodeData.name}
                    fullText={false}
                    setSnackbarState={setSnackbarState}
                />
                <OrgChartNodeText
                    type="name"
                    employeeNumber={nodeData.id}
                    content={nodeData.name}
                    fullText={true}
                    setSnackbarState={setSnackbarState}
                />
                <OrgChartNodeText
                    type="title"
                    employeeNumber={nodeData.id}
                    content={nodeData.title}
                    fullText={false}
                    setSnackbarState={setSnackbarState}
                />
                <OrgChartNodeText
                    type="title"
                    employeeNumber={nodeData.id}
                    content={nodeData.title}
                    fullText={true}
                    setSnackbarState={setSnackbarState}
                />
                <OrgChartNodeText
                    type="email"
                    employeeNumber={nodeData.id}
                    content={nodeData.email}
                    fullText={false}
                    setSnackbarState={setSnackbarState}
                />
                <OrgChartNodeText
                    type="email"
                    employeeNumber={nodeData.id}
                    content={nodeData.email}
                    fullText={true}
                    setSnackbarState={setSnackbarState}
                />
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

const mapDispatchToProps = (dispatch) => ({
    setSnackbarState: (snackbarState) =>
        dispatch(setSnackbarState(snackbarState)),
});

export default connect(null, mapDispatchToProps)(OrgChartNode);
