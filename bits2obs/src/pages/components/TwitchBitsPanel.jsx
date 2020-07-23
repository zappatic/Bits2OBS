import React, { useState, Fragment } from "react";
import { withStyles } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";

import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";

const RedButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(red[500]),
    backgroundColor: red[500],
    "&:hover": {
      backgroundColor: red[700],
    },
  },
}))(Button);

export default function TwitchBitsPanel(props) {
  const [showTwitchLogOutDialog, setShowTwitchLogOutDialog] = useState(false);
  const [showSimulateDialog, setShowSimulateDialog] = useState(false);
  const [simulatedBitsAmount, setSimulatedBitsAmount] = useState(100);

  const twitchLogOut = () => {
    localStorage.removeItem("twitch_access_token");
    localStorage.removeItem("twitch_channel_id");
    localStorage.removeItem("twitch_display_name");

    window.location.href = window.location.href.split("#")[0];
  };

  return (
    <Fragment>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h2">Twitch bits - {localStorage.getItem("twitch_display_name")}</Typography>
        </Grid>
        <Grid item xs={6}>
          {props.isTwitchConnected ? (
            <RedButton
              variant="contained"
              color="primary"
              style={{ marginRight: 15 }}
              onClick={() => {
                props.stopListeningForBits();
              }}
            >
              Stop
            </RedButton>
          ) : (
            <Button
              variant="contained"
              color="primary"
              style={{ marginRight: 15 }}
              onClick={() => {
                if (!props.isOBSConnected) {
                  props.showError("Please connect to OBS first");
                } else {
                  props.startListeningForBits();
                }
              }}
            >
              Start
            </Button>
          )}
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              if (!props.isOBSConnected) {
                props.showError("Please connect to OBS first");
              } else {
                setShowSimulateDialog(true);
              }
            }}
          >
            Simulate
          </Button>
        </Grid>
        <Grid item xs={6} align="right">
          <Button
            variant="contained"
            onClick={() => {
              setShowTwitchLogOutDialog(true);
            }}
          >
            Log out
          </Button>
        </Grid>

        <Grid item xs={12}>
          <TableContainer component={Paper} style={{ marginTop: 35 }}>
            <Table size="small">
              <TableBody>
                {props.receivedBits.map((rb, index) => {
                  return (
                    <TableRow key={index} style={index % 2 ? { backgroundColor: "#fafafa" } : null}>
                      <TableCell>
                        <Typography>
                          {rb.userName} ({rb.amountOfBits} <img src="/bits.png" alt="" height="15" />) &rarr; {rb.scene === "" ? <i>No scene matched</i> : <b>{rb.scene}</b>}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
      <Dialog
        open={showTwitchLogOutDialog}
        onClose={() => {
          setShowTwitchLogOutDialog(false);
        }}
        aria-labelledby="twitchlogoutdialog-title"
      >
        <DialogTitle id="twitchlogoutdialog-title">Log out from Twitch</DialogTitle>
        <DialogContent>
          <DialogContentText>This will erase the access token from the local browser storage.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setShowTwitchLogOutDialog(false);
            }}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              setShowTwitchLogOutDialog(false);
              twitchLogOut();
            }}
            color="primary"
          >
            Log out
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={showSimulateDialog}
        onClose={() => {
          setShowSimulateDialog(false);
        }}
        aria-labelledby="simulatedialog-title"
      >
        <DialogTitle id="simulatedialog-title">Simulate bits</DialogTitle>
        <DialogContent>
          <DialogContentText>Enter the amount of simulated bits</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Amount of bits"
            fullWidth
            value={simulatedBitsAmount}
            onChange={(e) => {
              const amount = e.target.value;
              if (!isNaN(amount) && amount > 0) {
                setSimulatedBitsAmount(amount);
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setShowSimulateDialog(false);
            }}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              setShowSimulateDialog(false);
              props.processBitsEvent("Simulation", parseInt(simulatedBitsAmount));
            }}
            color="primary"
          >
            Simulate
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
