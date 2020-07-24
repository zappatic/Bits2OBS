import React, { Fragment } from "react";
import { currencies } from "../../helpers/currencies";

import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import TableHead from "@material-ui/core/TableHead";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Tooltip from "@material-ui/core/Tooltip";

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
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell align="center">
                    <Tooltip title="Enter the required bits to trigger the scene in this column">
                      <img src="/bits.png" alt="" height="20" style={{ marginTop: 5 }} />
                    </Tooltip>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Enter the required amount of money and currency to trigger the scene in this column. Leave the currency blank to ignore it.">
                      <AttachMoneyIcon />
                    </Tooltip>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.availableScenes.map((scene, index) => {
                  return (
                    <TableRow key={scene} style={index % 2 ? { backgroundColor: "#fafafa" } : null}>
                      <TableCell style={{ width: "70%" }}>
                        <Typography>{scene}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <TextField
                          size="small"
                          margin="dense"
                          variant="outlined"
                          value={props.sceneCostBits(scene)}
                          style={{ width: 55 }}
                          inputProps={{
                            style: {
                              padding: 7,
                            },
                          }}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (!isNaN(value) && value >= 0) {
                              props.setSceneCostBits(scene, value);
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Grid container wrap="nowrap" direction="row" alignItems="center">
                          <Grid item>
                            <TextField
                              size="small"
                              margin="dense"
                              variant="outlined"
                              value={props.sceneCostMoney(scene)}
                              style={{ width: 55, marginRight: 5 }}
                              inputProps={{
                                style: {
                                  padding: 7,
                                },
                              }}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (!isNaN(value) && value >= 0) {
                                  props.setSceneCostMoney(scene, value);
                                }
                              }}
                            />
                          </Grid>
                          <Grid item>
                            <Select
                              size="small"
                              margin="dense"
                              variant="outlined"
                              value={props.sceneCostCurrency(scene)}
                              onChange={(e) => {
                                const value = e.target.value;
                                props.setSceneCostCurrency(scene, value);
                              }}
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
