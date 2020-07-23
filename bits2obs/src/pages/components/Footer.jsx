import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  footer: { textAlign: "center", color: "#999", fontSize: "0.9em" },
  footerLink: { color: "#999" },
}));

export default function Footer() {
  const classes = useStyles();

  return (
    <Typography className={classes.footer}>
      Created by{" "}
      <a href="https://twitter.com/zappatic" target="_blank" rel="noopener noreferrer" className={classes.footerLink}>
        @zappatic
      </a>{" "}
      - 2020
    </Typography>
  );
}
