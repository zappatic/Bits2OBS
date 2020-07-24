import React from "react";

import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import TouchAppIcon from "@material-ui/icons/TouchApp";
import LinkIcon from "@material-ui/icons/Link";
import { green } from "@material-ui/core/colors";

export default function DialogHelp(props) {
  return (
    <Dialog
      open={props.show}
      onClose={() => {
        props.hide();
      }}
      maxWidth="xl"
      fullWidth
    >
      <DialogContent>
        <Typography gutterBottom>
          This site allows you to have your Twitch viewers change scenes in OBS Studio based on cheering with bits or donating money through Streamlabs. The amount of bits cheered or money donated
          determines which scene is activated.
        </Typography>
        <Typography gutterBottom variant="h6">
          Configuration
        </Typography>
        <Typography gutterBottom>
          1. Install{" "}
          <a href="https://github.com/Palakis/obs-websocket/releases/" target="_blank" rel="noopener noreferrer">
            obs-websocket
          </a>{" "}
          on the machine that runs OBS Studio (read the install instructions under the changelog).
        </Typography>
        <Typography gutterBottom>2. In OBS Studio, you now have a "Websockets Server Settings" option in the Tools menu. Make sure the server is enabled.</Typography>
        <Typography gutterBottom>
          3. Fill in the connection details in the OBS section (the defaults are fine if you haven't changed anything in OBS and you are running it on the same machine as this browser window).
        </Typography>
        <Typography gutterBottom>
          4. Hit the connect button, and all your scenes should show up in the table on the right. Fill in the amount of bits and/or donation amount that should trigger each scene (enter 0 to
          disable). If you leave the currency blank that means that every donation for a certain monetary value will trigger the scene change, regardless of currency (e.g. 10 USD and 10 EUR)
        </Typography>
        <Typography gutterBottom>
          5. In the 'Connections' panel on the left, click <LinkIcon style={{ height: 15 }} /> for Twitch and/or Streamlabs to enable tracking of bits and/or donations.
        </Typography>
        <Typography gutterBottom>
          6. After successfully connecting to Twitch and/or Streamlabs, two new icons appear: <PlayCircleOutlineIcon style={{ height: 15, color: green[500] }} /> and
          <TouchAppIcon style={{ height: 15 }} />
        </Typography>
        <Typography gutterBottom>
          7. Click <TouchAppIcon style={{ height: 15 }} /> to open the simulation window, and enter a value that matches a scene. Check whether OBS has transitioned to this scene.
        </Typography>
        <Typography gutterBottom>
          8. Hit <PlayCircleOutlineIcon style={{ height: 15, color: green[500] }} /> to start listening for incoming bits/donations.
        </Typography>
        <Typography gutterBottom variant="h6">
          Privacy
        </Typography>
        <Typography gutterBottom>
          All functionality runs entirely in your browser, there is no server backend storing any information. Everything is stored in your local browser storage. The only thing that gets saved is
          your IP address in the Apache webserver logs when you opened this site, which is rotated out of the logs after a few days. All connections (to OBS and Twitch) are made from within your
          browser itself, except the fetching of the access token for Streamlabs (it is just passed through, not stored anywhere but in your local browser).
        </Typography>
        <Typography gutterBottom variant="h6">
          Troubleshooting
        </Typography>
        <Typography gutterBottom>
          If you are not running the browser on the same machine as OBS (so you'd have to enter an IP address instead of 'localhost'), make sure to load this site over http:// instead of https://
          because the websocket connection exposed by OBS runs unsecured, and your browser will refuse to make a connection from a https:// website to an unsecured websocket.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            props.hide();
          }}
          color="primary"
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
