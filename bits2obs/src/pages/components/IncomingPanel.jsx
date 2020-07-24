import React, { Fragment } from "react";

import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";

export default function IncomingPanel(props) {
  return (
    <Fragment>
      <Typography variant="h2">Incoming bits &amp; donations</Typography>
      <TableContainer component={Paper} style={{ marginTop: 5 }}>
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
      {props.receivedBits.length === 0 ? <Typography component="i">No bits or donations yet...</Typography> : null}
    </Fragment>
  );
}
