import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import io from "socket.io-client";
import { useDispatch } from "react-redux";
import { addIncomingEntry } from "../redux/actions/incomingActions";

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
let streamlabsSocket = null;

const useStyles = makeStyles((theme) => ({
  mainPaper: { margin: "15px auto", padding: 35, width: "80%" },
  errorSnackbar: { backgroundColor: theme.palette.error.dark },
  errorSnackbarMessage: { display: "flex", alignItems: "center" },
  errorSnackbarIcon: { fontSize: 20 },
  errorSnackbarIconVariant: { opacity: 0.9, marginRight: theme.spacing(1) },
}));

export default function Dashboard(props) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [availableScenes, setAvailableScenes] = useState([]);
  const [sceneCosts, setSceneCosts] = useState([]);
  const [isConnectingToOBS, setIsConnectingToOBS] = useState(false);
  const [isOBSConnected, setIsOBSConnected] = useState(false);
  const [isTwitchSocketConnected, setIsTwitchSocketConnected] = useState(false);
  const [isStreamlabsSocketConnected, setIsStreamlabsSocketConnected] = useState(false);
  const [showErrorSnackbar, setShowErrorSnackbar] = useState(false);
  const [errorSnackbarMessage, setErrorSnackbarMessage] = useState("");
  const [showHelpDialog, setShowHelpDialog] = useState(localStorage.getItem("help_shown") === null);

  useEffect(() => {
    const savedCosts = localStorage.getItem("scene_costs");
    if (savedCosts !== null) {
      const tmp = JSON.parse(savedCosts);
      if (Array.isArray(tmp)) {
        setSceneCosts(tmp);
      }
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
    const entry = { type: "bits", userName, amountOfBits, scene: "" };
    for (let x = 0; x < sceneCosts.length; ++x) {
      const sc = sceneCosts[x];
      if (amountOfBits === parseInt(sc.costBits)) {
        switchToScene(sc.sceneName);
        entry.scene = sc.sceneName;
        break;
      }
    }

    dispatch(addIncomingEntry(entry));
  };

  const processDonationEvent = (userName, amount, currency) => {
    const entry = { type: "donation", userName, amount, currency, scene: "" };
    for (let x = 0; x < sceneCosts.length; ++x) {
      const sc = sceneCosts[x];
      if (amount === sc.costMoney && (sc.currency === "" || currency === sc.currency)) {
        switchToScene(sc.sceneName);
        entry.scene = sc.sceneName;
        break;
      }
    }
    dispatch(addIncomingEntry(entry));
  };

  const sceneCostBits = (sceneName) => {
    for (let x = 0; x < sceneCosts.length; ++x) {
      const sc = sceneCosts[x];
      if (sc.sceneName === sceneName) {
        return sc.costBits;
      }
    }
    return 0;
  };

  const sceneCostMoney = (sceneName) => {
    for (let x = 0; x < sceneCosts.length; ++x) {
      const sc = sceneCosts[x];
      if (sc.sceneName === sceneName) {
        return sc.costMoney;
      }
    }
    return 0;
  };

  const sceneCostCurrency = (sceneName) => {
    for (let x = 0; x < sceneCosts.length; ++x) {
      const sc = sceneCosts[x];
      if (sc.sceneName === sceneName) {
        return sc.currency;
      }
    }
    return "";
  };

  const setSceneCostBits = (sceneName, costBits) => {
    const a = [...sceneCosts];
    let found = false;
    for (let x = 0; x < a.length; ++x) {
      if (a[x].sceneName === sceneName) {
        a[x].costBits = costBits;
        found = true;
      }
    }
    if (!found) {
      a.push({ sceneName, costBits, costMoney: 0, currency: "" });
    }
    setSceneCosts(a);
    localStorage.setItem("scene_costs", JSON.stringify(a));
  };

  const setSceneCostMoney = (sceneName, costMoney) => {
    const a = [...sceneCosts];
    let found = false;
    for (let x = 0; x < a.length; ++x) {
      if (a[x].sceneName === sceneName) {
        a[x].costMoney = costMoney;
        found = true;
      }
    }
    if (!found) {
      a.push({ sceneName, costBits: 0, costMoney, currency: "" });
    }
    setSceneCosts(a);
    localStorage.setItem("scene_costs", JSON.stringify(a));
  };

  const setSceneCostCurrency = (sceneName, currency) => {
    const a = [...sceneCosts];
    let found = false;
    for (let x = 0; x < a.length; ++x) {
      if (a[x].sceneName === sceneName) {
        a[x].currency = currency;
        found = true;
      }
    }
    if (!found) {
      a.push({ sceneName, costBits: 0, costMoney: 0, currency });
    }
    setSceneCosts(a);
    localStorage.setItem("scene_costs", JSON.stringify(a));
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
      } catch (err) {
        console.log(err);
      }
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

  const startListeningForDonations = () => {
    const socketToken = localStorage.getItem("streamlabs_socket_token");

    streamlabsSocket = io(`https://sockets.streamlabs.com?token=${socketToken}`, { transports: ["websocket"] });
    streamlabsSocket.on("connect", () => {
      setIsStreamlabsSocketConnected(true);
    });
    streamlabsSocket.on("disconnect", () => {
      setIsStreamlabsSocketConnected(false);
    });
    streamlabsSocket.on("error", (error) => {
      console.log(error);
      stopListeningForDonations();
    });

    streamlabsSocket.on("event", (eventData) => {
      if (!eventData.for && eventData.type === "donation") {
        const data = eventData.message[0];
        console.log("processing", data.name, data.amount, data.currency);
        processDonationEvent(data.name, data.amount, data.currency);
      }
    });
  };

  const stopListeningForDonations = () => {
    streamlabsSocket.close();
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
              startListeningForDonations={startListeningForDonations}
              stopListeningForDonations={stopListeningForDonations}
              isStreamlabsSocketConnected={isStreamlabsSocketConnected}
              isStreamlabsConnected={props.isStreamlabsConnected}
              disconnectTwitch={props.disconnectTwitch}
              disconnectStreamlabs={props.disconnectStreamlabs}
              showError={showError}
              processBitsEvent={processBitsEvent}
              processDonationEvent={processDonationEvent}
            />
            <IncomingPanel />
          </Grid>
          <Grid item xs={6}>
            <OBSConnectPanel connectToOBS={connectToOBS} isConnectingToOBS={isConnectingToOBS} />
            <OBSScenesPanel
              availableScenes={availableScenes}
              sceneCostBits={sceneCostBits}
              sceneCostMoney={sceneCostMoney}
              sceneCostCurrency={sceneCostCurrency}
              setSceneCostBits={setSceneCostBits}
              setSceneCostMoney={setSceneCostMoney}
              setSceneCostCurrency={setSceneCostCurrency}
            />
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
          localStorage.setItem("help_shown", true);
          setShowHelpDialog(false);
        }}
      />
    </Fragment>
  );
}
