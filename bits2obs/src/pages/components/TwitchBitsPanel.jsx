import React, { Fragment } from "react";

import Typography from "@material-ui/core/Typography";

export default function TwitchBitsPanel(props) {
  return (
    <Fragment>
      <Typography variant="h2">Twitch bits - {localStorage.getItem("twitch_display_name")}</Typography>
    </Fragment>
  );
}
