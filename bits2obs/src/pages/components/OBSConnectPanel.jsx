import React, { useState, useEffect, Fragment } from "react";

import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";

export default function OBSConnectPanel(props) {
  const [OBSIPAddress, setOBSIPAddress] = useState("localhost");
  const [OBSPort, setOBSPort] = useState("4444");
  const [OBSPassword, setOBSPassword] = useState("");

  useEffect(() => {
    const ipAddress = localStorage.getItem("obs_ipaddress");
    if (ipAddress !== null) {
      setOBSIPAddress(ipAddress);
    }
    const port = localStorage.getItem("obs_port");
    if (port !== null) {
      setOBSPort(port);
    }
    const password = localStorage.getItem("obs_password");
    if (password !== null) {
      setOBSPassword(password);
    }
  }, []);

  return (
    <Fragment>
      <Typography variant="h2">OBS</Typography>
      <Grid container spacing={2}>
        <Grid item xs={9}>
          <TextField
            label="IP address"
            variant="outlined"
            size="small"
            onChange={(e) => {
              setOBSIPAddress(e.target.value);
              localStorage.setItem("obs_ipaddress", e.target.value);
            }}
            value={OBSIPAddress}
            fullWidth
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            label="Port"
            variant="outlined"
            size="small"
            onChange={(e) => {
              setOBSPort(e.target.value);
              localStorage.setItem("obs_port", e.target.value);
            }}
            value={OBSPort}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            type="password"
            label="Password"
            variant="outlined"
            size="small"
            onChange={(e) => {
              setOBSPassword(e.target.value);
              localStorage.setItem("obs_password", e.target.value);
            }}
            value={OBSPassword}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              props.connectToOBS(OBSIPAddress, OBSPort, OBSPassword);
            }}
          >
            Connect
          </Button>

          <CircularProgress style={{ display: props.isConnectingToOBS ? "block" : "none", marginTop: 15 }} />
        </Grid>
      </Grid>
    </Fragment>
  );
}
