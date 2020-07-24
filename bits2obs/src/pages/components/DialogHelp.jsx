import React from "react";

import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";

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
        <DialogContentText>
          <Typography gutterBottom>
            This site allows you to have your Twitch viewers change scenes in OBS Studio based on cheering with bits or donating money through Streamlabs. The amount of bits cheered or money donated
            determines which scene is activated.
          </Typography>
          <Typography variant="h6">Configuration</Typography>
          <Typography>
            1. Install{" "}
            <a href="https://github.com/Palakis/obs-websocket/releases/" target="_blank" rel="noopener noreferrer">
              obs-websocket
            </a>{" "}
            on the machine that runs OBS Studio (read the install instructions under the changelog).
          </Typography>
          <Typography>2. In OBS Studio, you now have a "Websockets Server Settings" option in the Tools menu. Make sure the server is enabled.</Typography>
          <Typography>3. Click on the 'Login to Twitch' button above to request an access token, so the site can access your bits.</Typography>
          <Typography>
            4. After successfully connecting to Twitch, fill in the details in the OBS section (defaults are fine if you haven't changed anything and you are running OBS Studio on the same machine as
            this browser window).
          </Typography>
          <Typography>
            5. Hit the connect button, and all your scenes should show up in the table on the right. Fill in the amount of bits that should trigger each scene (enter 0 to disable)
          </Typography>
          <Typography>6. Click the 'Simulate' button, and enter a value that matches a scene. Check whether OBS has transitioned to this scene.</Typography>
          <Typography gutterBottom>7. Hit the 'Start' button to start listening for incoming bits.</Typography>
          <Typography variant="h6">Privacy</Typography>
          <Typography gutterBottom>
            All functionality runs entirely in your browser, there is no server backend storing any information. Everything is stored in your local browser storage. The only thing that gets saved is
            your IP address in the Apache webserver logs when you opened this site, which is rotated out of the logs after a few days. All connections (to OBS and Twitch) are made from within your
            browser itself.
          </Typography>
          <Typography variant="h6">Troubleshooting</Typography>
          <Typography gutterBottom>
            If you are not running the browser on the same machine as OBS (so you'd have to enter an IP address instead of 'localhost'), make sure to load this site over http:// instead of https://
            because the websocket connection exposed by OBS runs unsecured, and your browser will refuse to make a connection from a https:// website to an unsecured websocket.
          </Typography>
        </DialogContentText>
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
