import React, { Fragment } from "react";

import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import Box from "@material-ui/core/Box";

export default function OBSConnectPanel(props) {
  return (
    <Fragment>
      <Typography variant="h2" style={{ marginTop: 40 }}>
        Scenes
      </Typography>
      {props.availableScenes.length === 0 ? (
        <Typography component="i">No scenes available</Typography>
      ) : (
        <Grid container>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableBody>
                {props.availableScenes.map((scene, index) => {
                  return (
                    <TableRow key={scene} style={index % 2 ? { backgroundColor: "#fafafa" } : null}>
                      <TableCell style={{ width: "70%" }}>
                        <Typography>{scene}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Grid container alignItems="center">
                          <Grid item xs={4}>
                            <Box display="flex" justifyContent="right">
                              <img src="/bits.png" alt="" height="20" style={{ marginTop: 5 }} />
                            </Box>
                          </Grid>
                          <Grid item xs={8}>
                            <TextField
                              size="small"
                              margin="dense"
                              variant="outlined"
                              value={props.sceneCost(scene)}
                              style={{ width: 55 }}
                              inputProps={{
                                style: {
                                  padding: 7,
                                },
                              }}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (!isNaN(value) && value >= 0) {
                                  props.setSceneCost(scene, value);
                                }
                              }}
                            />
                          </Grid>
                        </Grid>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      )}
    </Fragment>
  );
}
