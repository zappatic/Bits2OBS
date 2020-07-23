import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import config from "../config.json";

import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
  mainPaper: { margin: "15px auto", padding: 35, width: "60%" },
}));

export default function LoginToTwitch() {
  const classes = useStyles();

  return (
    <Paper className={classes.mainPaper}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Typography align="center" variant="h1">
            Bits2OBS
          </Typography>
          <Typography align="center">Change OBS Studio scenes when receiving Twitch bits</Typography>
        </Grid>
        <Grid item xs={12} style={{ textAlign: "center" }}>
          <Button
            variant="contained"
            color="primary"
            href={"https://id.twitch.tv/oauth2/authorize?client_id=" + config.twitchclientid + "&redirect_uri=" + config.twitchredirect + "&response_type=token&scope=bits:read&force_verify=true"}
          >
            Login to Twitch
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}
