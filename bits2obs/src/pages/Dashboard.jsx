import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

import OBSConnectPanel from "./components/OBSConnectPanel";
import OBSScenesPanel from "./components/OBSScenesPanel";
import TwitchBitsPanel from "./components/TwitchBitsPanel";

import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import IconButton from "@material-ui/core/IconButton";
import ErrorIcon from "@material-ui/icons/Error";
import CloseIcon from "@material-ui/icons/Close";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

const OBSWebSocket = require("obs-websocket-js");
const obs = new OBSWebSocket();
const useStyles = makeStyles((theme) => ({
  mainPaper: { margin: "15px auto", padding: 35, width: "80%" },
  errorSnackbar: { backgroundColor: theme.palette.error.dark },
  errorSnackbarMessage: { display: "flex", alignItems: "center" },
  errorSnackbarIcon: { fontSize: 20 },
  errorSnackbarIconVariant: { opacity: 0.9, marginRight: theme.spacing(1) },
}));

export default function Dashboard() {
  const classes = useStyles();

  const [availableScenes, setAvailableScenes] = useState([]);
  const [sceneCosts, setSceneCosts] = useState({});
  const [isConnectingToOBS, setIsConnectingToOBS] = useState(false);
  const [showErrorSnackbar, setShowErrorSnackbar] = useState(false);
  const [errorSnackbarMessage, setErrorSnackbarMessage] = useState("");

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
      })
      .catch((err) => {
        showError(err.description);
        console.log(err);
        setIsConnectingToOBS(false);
      });
  };

  const switchToScene = (sceneName) => {
    obs.send("SetCurrentScene", {
      "scene-name": sceneName,
    });
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

  return (
    <Fragment>
      <Paper className={classes.mainPaper}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Typography align="center" variant="h1">
              Bits2OBS
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <TwitchBitsPanel />
          </Grid>
          <Grid item xs={6}>
            <OBSConnectPanel connectToOBS={connectToOBS} isConnectingToOBS={isConnectingToOBS} />
            <OBSScenesPanel availableScenes={availableScenes} sceneCost={sceneCost} setSceneCost={setSceneCost} />
          </Grid>
        </Grid>
      </Paper>

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
    </Fragment>
  );
}
