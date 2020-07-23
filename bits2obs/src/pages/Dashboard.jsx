import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
//import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
  mainPaper: { margin: "15px auto", padding: 35, width: "80%" },
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
        </Grid>
        <Grid item xs={6}>
          twitch stuff
        </Grid>
        <Grid item xs={6}>
          OBS stuff
        </Grid>
      </Grid>
    </Paper>
  );
}
