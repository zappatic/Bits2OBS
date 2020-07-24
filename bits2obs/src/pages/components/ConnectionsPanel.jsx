import React, { useState, Fragment } from "react";
import config from "../../config.json";
import { red, green } from "@material-ui/core/colors";

import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
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
import IconButton from "@material-ui/core/IconButton";
import LinkIcon from "@material-ui/icons/Link";
import LinkOffIcon from "@material-ui/icons/LinkOff";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import StopIcon from "@material-ui/icons/Stop";
import TouchAppIcon from "@material-ui/icons/TouchApp";
import Tooltip from "@material-ui/core/Tooltip";

export default function ConnectionsPanel(props) {
  const [showTwitchDisconnectDialog, setShowTwitchDisconnectDialog] = useState(false);
  const [showSimulateBitsDialog, setShowSimulateBitsDialog] = useState(false);
  const [simulatedBitsAmount, setSimulatedBitsAmount] = useState(100);

  const disconnectTwitch = () => {
    localStorage.removeItem("twitch_access_token");
    localStorage.removeItem("twitch_channel_id");
    localStorage.removeItem("twitch_display_name");
  };

  return (
    <Fragment>
      <Typography variant="h2">Connections</Typography>
      <TableContainer component={Paper} style={{ marginBottom: 35 }}>
        <Table size="small">
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography>Twitch</Typography>
              </TableCell>
              <TableCell>
                {localStorage.getItem("twitch_access_token") === null ? (
                  <Tooltip title="Connect to Twitch" placement="top">
                    <IconButton
                      size="small"
                      href={
                        "https://id.twitch.tv/oauth2/authorize?client_id=" +
                        config.twitchclientid +
                        "&redirect_uri=" +
                        (window.location.href.startsWith("https") ? "https://" : "http://") +
                        config.twitchredirect +
                        "&response_type=token&scope=bits:read&force_verify=true"
                      }
                    >
                      <LinkIcon />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <Tooltip title="Disconnect from Twitch" placement="top">
                    <IconButton
                      size="small"
                      onClick={() => {
                        setShowTwitchDisconnectDialog(true);
                      }}
                    >
                      <LinkOffIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </TableCell>
              <TableCell>
                {localStorage.getItem("twitch_access_token") === null ? null : props.isTwitchSocketConnected ? (
                  <Tooltip title="Stop tracking bits" placement="top">
                    <IconButton
                      size="small"
                      style={{ color: red[500] }}
                      onClick={() => {
                        props.stopListeningForBits();
                      }}
                    >
                      <StopIcon />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <Tooltip title="Start tracking bits" placement="top">
                    <IconButton
                      size="small"
                      style={{ color: green[500] }}
                      onClick={() => {
                        if (!props.isOBSConnected) {
                          props.showError("Please connect to OBS first");
                        } else {
                          props.startListeningForBits();
                        }
                      }}
                    >
                      <PlayCircleOutlineIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </TableCell>
              <TableCell>
                {localStorage.getItem("twitch_access_token") === null ? null : (
                  <Tooltip title="Simulate bits" placement="top">
                    <IconButton
                      size="small"
                      onClick={() => {
                        if (!props.isOBSConnected) {
                          props.showError("Please connect to OBS first");
                        } else {
                          setShowSimulateBitsDialog(true);
                        }
                      }}
                    >
                      <TouchAppIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography>Streamlabs</Typography>
              </TableCell>
              <TableCell>
                <Tooltip title="Connect to Streamlabs" placement="top">
                  <IconButton size="small">
                    <LinkIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
              <TableCell>
                <Tooltip title="Start tracking donations" placement="top">
                  <IconButton size="small">
                    <PlayCircleOutlineIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
              <TableCell>
                <Tooltip title="Simulate donation" placement="top">
                  <IconButton size="small">
                    <TouchAppIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog
        open={showTwitchDisconnectDialog}
        onClose={() => {
          setShowTwitchDisconnectDialog(false);
        }}
        aria-labelledby="twitchdisconnectdialog-title"
      >
        <DialogTitle id="twitchdisconnectdialog-title">Disconnect from Twitch</DialogTitle>
        <DialogContent>
          <DialogContentText>This will erase the access token from the local browser storage.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setShowTwitchDisconnectDialog(false);
            }}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              setShowTwitchDisconnectDialog(false);
              disconnectTwitch();
            }}
            color="primary"
          >
            Disconnect
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={showSimulateBitsDialog}
        onClose={() => {
          setShowSimulateBitsDialog(false);
        }}
        aria-labelledby="simulatebitsdialog-title"
      >
        <DialogTitle id="simulatebitsdialog-title">Simulate bits</DialogTitle>
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
              setShowSimulateBitsDialog(false);
            }}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              setShowSimulateBitsDialog(false);
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
