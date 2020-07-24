import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

import OBSConnectPanel from "./components/OBSConnectPanel";
import OBSScenesPanel from "./components/OBSScenesPanel";
import ConnectionsPanel from "./components/ConnectionsPanel";
import IncomingPanel from "./components/IncomingPanel";
import Footer from "./components/Footer";
import DialogHelp from "./components/DialogHelp";

import Box from "@material-ui/core/Box";
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import IconButton from "@material-ui/core/IconButton";
import ErrorIcon from "@material-ui/icons/Error";
import CloseIcon from "@material-ui/icons/Close";
import HelpIcon from "@material-ui/icons/Help";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

const OBSWebSocket = require("obs-websocket-js");
const obs = new OBSWebSocket();
let twitchSocket = null;
let twitchPongTimeoutID = 0;
let twitchPingIntervalID = 0;

const useStyles = makeStyles((theme) => ({
  mainPaper: { margin: "15px auto", padding: 35, width: "80%" },
  errorSnackbar: { backgroundColor: theme.palette.error.dark },
  errorSnackbarMessage: { display: "flex", alignItems: "center" },
  errorSnackbarIcon: { fontSize: 20 },
  errorSnackbarIconVariant: { opacity: 0.9, marginRight: theme.spacing(1) },
}));

export default function Dashboard(props) {
  const classes = useStyles();

  const [availableScenes, setAvailableScenes] = useState([]);
  const [sceneCosts, setSceneCosts] = useState({});
  const [isConnectingToOBS, setIsConnectingToOBS] = useState(false);
  const [isOBSConnected, setIsOBSConnected] = useState(false);
  const [isTwitchSocketConnected, setIsTwitchSocketConnected] = useState(false);
  const [receivedBits, setReceivedBits] = useState([]);
  const [showErrorSnackbar, setShowErrorSnackbar] = useState(false);
  const [errorSnackbarMessage, setErrorSnackbarMessage] = useState("");
  const [showHelpDialog, setShowHelpDialog] = useState(localStorage.getItem("help-shown") === null);

  useEffect(() => {
    const savedCosts = localStorage.getItem("scene_costs");
    if (savedCosts !== null) {
      setSceneCosts(JSON.parse(savedCosts));
    }
  }, []);

  const connectToOBS = (ipAddress, port, password) => {
    setIsConnectingToOBS(true);
    obs
      .connect({
        address: ipAddress + ":" + port,
        password: password,
      })
      .then(() => {
        return obs.send("GetSceneList");
      })
      .then((data) => {
        const scenes = [];
        data.scenes.forEach((scene) => {
          scenes.push(scene.name);
        });
        setAvailableScenes(scenes);
        setIsConnectingToOBS(false);
        setIsOBSConnected(true);
      })
      .catch((err) => {
        if (err.hasOwnProperty("description")) {
          showError(err.description);
        } else if (err.hasOwnProperty("error")) {
          showError(err.error);
        }
        console.log(err);
        setIsConnectingToOBS(false);
        setIsOBSConnected(false);
      });
  };

  const switchToScene = (sceneName) => {
    obs.send("SetCurrentScene", {
      "scene-name": sceneName,
    });
  };

  const processBitsEvent = (userName, amountOfBits) => {
    const entry = { userName, amountOfBits, scene: "" };
    for (const [sceneName, cost] of Object.entries(sceneCosts)) {
      if (amountOfBits === parseInt(cost)) {
        switchToScene(sceneName);
        entry.scene = sceneName;
        break;
      }
    }

    const a = [...receivedBits];
    a.unshift(entry);
    setReceivedBits(a);
  };

  const sceneCost = (sceneName) => {
    if (sceneCosts.hasOwnProperty(sceneName)) {
      return sceneCosts[sceneName];
    } else {
      return 0;
    }
  };

  const setSceneCost = (sceneName, cost) => {
    const o = Object.assign({}, sceneCosts);
    o[sceneName] = cost;
    setSceneCosts(o);

    localStorage.setItem("scene_costs", JSON.stringify(o));
  };

  const showError = (msg) => {
    setErrorSnackbarMessage(msg);
    setShowErrorSnackbar(true);
  };

  const closeErrorSnackbar = () => {
    setShowErrorSnackbar(false);
  };

  const startListeningForBits = () => {
    twitchSocket = new WebSocket("wss://pubsub-edge.twitch.tv");
    twitchSocket.onopen = () => {
      setIsTwitchSocketConnected(true);
      twitchSocket.send(
        JSON.stringify({ type: "LISTEN", data: { topics: ["channel-bits-events-v2." + localStorage.getItem("twitch_channel_id")], auth_token: localStorage.getItem("twitch_access_token") } })
      );
      twitchPingIntervalID = window.setInterval(() => {
        sendTwitchPING();
      }, 60 * 1000);
    };
    twitchSocket.onclose = (e) => {
      setIsTwitchSocketConnected(false);
      console.log("Closed Twitch web socket");
    };
    twitchSocket.onerror = (e) => {
      console.log("Twitch Web socket error", e);
      twitchSocket.close();
    };
    twitchSocket.onmessage = (e) => {
      try {
        const parsed = JSON.parse(e.data);
        if (parsed.hasOwnProperty("type")) {
          if (parsed.type === "RESPONSE") {
            if (parsed.hasOwnProperty("error") && parsed.error !== "") {
              showError(parsed.error);
            }
          } else if (parsed.type === "RECONNECT") {
            reconnectToTwitch();
          } else if (parsed.type === "PONG") {
            window.clearTimeout(twitchPongTimeoutID);
          } else if (parsed.type === "MESSAGE") {
            const message = JSON.parse(parsed.data.message);
            const amountOfBits = message.data.bits_used;
            let userName = "Anonymous";
            if (message.data.hasOwnProperty("user_name") && message.data.user_name !== null) {
              userName = message.data.user_name;
            }
            processBitsEvent(userName, amountOfBits);
          }
        }
      } catch (err) {}
    };
  };

  const stopListeningForBits = () => {
    window.clearInterval(twitchPingIntervalID);
    twitchSocket.close();
  };

  const reconnectToTwitch = () => {
    stopListeningForBits();
    startListeningForBits();
  };

  const sendTwitchPING = () => {
    if (twitchSocket.readyState === 1) {
      twitchSocket.send(JSON.stringify({ type: "PING" }));
      twitchPongTimeoutID = window.setTimeout(() => {
        console.log("No PONG received for 10 seconds -> reconnecting");
        reconnectToTwitch();
      }, 10 * 1000);
    }
  };

  return (
    <Fragment>
      <Paper className={classes.mainPaper}>
        <Box display="flex" justifyContent="flex-end">
          <IconButton
            size="small"
            onClick={() => {
              setShowHelpDialog(true);
            }}
          >
            <HelpIcon />
          </IconButton>
        </Box>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Typography align="center" variant="h1">
              Bits2OBS
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <ConnectionsPanel
              isOBSConnected={isOBSConnected}
              startListeningForBits={startListeningForBits}
              stopListeningForBits={stopListeningForBits}
              isTwitchSocketConnected={isTwitchSocketConnected}
              isTwitchConnected={props.isTwitchConnected}
              isStreamlabsConnected={props.isStreamlabsConnected}
              disconnectTwitch={props.disconnectTwitch}
              disconnectStreamlabs={props.disconnectStreamlabs}
              showError={showError}
              processBitsEvent={processBitsEvent}
            />
            <IncomingPanel receivedBits={receivedBits} />
          </Grid>
          <Grid item xs={6}>
            <OBSConnectPanel connectToOBS={connectToOBS} isConnectingToOBS={isConnectingToOBS} />
            <OBSScenesPanel availableScenes={availableScenes} sceneCost={sceneCost} setSceneCost={setSceneCost} />
          </Grid>
        </Grid>
      </Paper>
      <Footer />

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={showErrorSnackbar}
        onClose={closeErrorSnackbar}
        action={
          <Fragment>
            <IconButton size="small" aria-label="close" color="inherit" onClick={closeErrorSnackbar}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Fragment>
        }
      >
        <SnackbarContent
          className={classes.errorSnackbar}
          onClose={closeErrorSnackbar}
          aria-describedby="errorsb"
          message={
            <span id="errorsb" className={classes.errorSnackbarMessage}>
              <ErrorIcon className={clsx(classes.errorSnackbarIcon, classes.errorSnackbarIconVariant)} />
              {errorSnackbarMessage}
            </span>
          }
          action={[
            <IconButton key="close" aria-label="close" color="inherit" onClick={closeErrorSnackbar}>
              <CloseIcon className={classes.icon} />
            </IconButton>,
          ]}
        />
      </Snackbar>
      <DialogHelp
        show={showHelpDialog}
        hide={() => {
          localStorage.setItem("help-shown", true);
          setShowHelpDialog(false);
        }}
      />
    </Fragment>
  );
}
