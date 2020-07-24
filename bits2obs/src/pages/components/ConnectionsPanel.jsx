import React, { useState, Fragment } from "react";
import config from "../../config.json";
import { currencies } from "../../helpers/currencies";
import { red, green } from "@material-ui/core/colors";

import Paper from "@material-ui/core/Paper";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
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
  const [showStreamlabsDisconnectDialog, setShowStreamlabsDisconnectDialog] = useState(false);
  const [showSimulateBitsDialog, setShowSimulateBitsDialog] = useState(false);
  const [simulatedBitsAmount, setSimulatedBitsAmount] = useState("100");
  const [showSimulateDonationDialog, setShowSimulateDonationDialog] = useState(false);
  const [simulatedDonationAmount, setSimulatedDonationAmount] = useState("10");
  const [simulatedDonationCurrency, setSimulatedDonationCurrency] = useState("USD");

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
                {props.isTwitchConnected ? (
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
                ) : (
                  <Tooltip title="Connect to Twitch" placement="top">
                    <IconButton
                      size="small"
                      href={
                        "https://id.twitch.tv/oauth2/authorize?client_id=" +
                        config.twitchclientid +
                        "&redirect_uri=" +
                        (window.location.href.startsWith("https") ? "https://" : "http://") +
                        config.twitchredirect +
                        "&response_type=token&scope=bits:read&force_verify=true&state=twitch" +
                        Date.now()
                      }
                    >
                      <LinkIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </TableCell>
              <TableCell>
                {props.isTwitchConnected ? (
                  props.isTwitchSocketConnected ? (
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
                  )
                ) : null}
              </TableCell>
              <TableCell>
                {props.isTwitchConnected ? (
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
                ) : null}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography>Streamlabs</Typography>
              </TableCell>
              <TableCell>
                {props.isStreamlabsConnected ? (
                  <Tooltip title="Disconnect from Streamlabs" placement="top">
                    <IconButton
                      size="small"
                      onClick={() => {
                        setShowStreamlabsDisconnectDialog(true);
                      }}
                    >
                      <LinkOffIcon />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <Tooltip title="Connect to Streamlabs" placement="top">
                    <IconButton
                      size="small"
                      href={
                        "https://www.streamlabs.com/api/v1.0/authorize?client_id=" +
                        config.streamlabsclientid +
                        "&redirect_uri=" +
                        config.streamlabsredirect +
                        "&response_type=code&scope=donations.read%20socket.token&state=streamlabs" +
                        Date.now()
                      }
                    >
                      <LinkIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </TableCell>
              <TableCell>
                {props.isStreamlabsConnected ? (
                  props.isStreamlabsSocketConnected ? (
                    <Tooltip title="Stop tracking donations" placement="top">
                      <IconButton
                        size="small"
                        style={{ color: red[500] }}
                        onClick={() => {
                          props.stopListeningForDonations();
                        }}
                      >
                        <StopIcon />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Start tracking donations" placement="top">
                      <IconButton
                        size="small"
                        style={{ color: green[500] }}
                        onClick={() => {
                          if (!props.isOBSConnected) {
                            props.showError("Please connect to OBS first");
                          } else {
                            props.startListeningForDonations();
                          }
                        }}
                      >
                        <PlayCircleOutlineIcon />
                      </IconButton>
                    </Tooltip>
                  )
                ) : null}
              </TableCell>
              <TableCell>
                {props.isStreamlabsConnected ? (
                  <Tooltip title="Simulate donation" placement="top">
                    <IconButton
                      size="small"
                      onClick={() => {
                        if (!props.isOBSConnected) {
                          props.showError("Please connect to OBS first");
                        } else {
                          setShowSimulateDonationDialog(true);
                        }
                      }}
                    >
                      <TouchAppIcon />
                    </IconButton>
                  </Tooltip>
                ) : null}
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
              props.disconnectTwitch();
            }}
            color="primary"
          >
            Disconnect
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={showStreamlabsDisconnectDialog}
        onClose={() => {
          setShowStreamlabsDisconnectDialog(false);
        }}
        aria-labelledby="streamlabsdisconnectdialog-title"
      >
        <DialogTitle id="streamlabsdisconnectdialog-title">Disconnect from Streamlabs</DialogTitle>
        <DialogContent>
          <DialogContentText>This will erase the access token from the local browser storage.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setShowStreamlabsDisconnectDialog(false);
            }}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              setShowStreamlabsDisconnectDialog(false);
              props.disconnectStreamlabs();
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
      <Dialog
        open={showSimulateDonationDialog}
        onClose={() => {
          setShowSimulateDonationDialog(false);
        }}
        aria-labelledby="simulatedonationdialog-title"
      >
        <DialogTitle id="simulatedonationdialog-title">Simulate donation</DialogTitle>
        <DialogContent>
          <DialogContentText>Enter the amount of the simulated donation</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Amount"
            fullWidth
            value={simulatedDonationAmount}
            onChange={(e) => {
              const amount = e.target.value;
              if (!isNaN(amount) && amount > 0) {
                setSimulatedDonationAmount(amount);
              }
            }}
          />
          <Select
            size="small"
            margin="dense"
            label="Currency"
            fullWidth
            value={simulatedDonationCurrency}
            onChange={(e) => {
              setSimulatedDonationCurrency(e.target.value);
            }}
            style={{ marginTop: 10 }}
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            {currencies.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setShowSimulateDonationDialog(false);
            }}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              setShowSimulateDonationDialog(false);
              props.processDonationEvent("Simulation", simulatedDonationAmount, simulatedDonationCurrency);
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
