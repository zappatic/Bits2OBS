import { createMuiTheme } from "@material-ui/core/styles";

const Bits2OBSTheme = createMuiTheme({
  palette: {
    primary: { main: "#3E95CC", dark: "#276891" },
    secondary: { main: "#64A690", dark: "#437564", contrastText: "#444" },
  },
  typography: {
    h1: { fontSize: 34, marginBottom: 25, fontWeight: 400 },
  },
});

export default Bits2OBSTheme;
