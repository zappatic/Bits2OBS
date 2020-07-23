import { createMuiTheme } from "@material-ui/core/styles";

const Bits2OBSTheme = createMuiTheme({
  palette: {
    primary: { main: "#3E95CC", dark: "#276891" },
    secondary: { main: "#64A690", dark: "#437564", contrastText: "#444" },
  },
  typography: {
    h1: { fontSize: 34, marginBottom: 25, fontWeight: 400 },
    h2: { fontSize: 22, marginBottom: 15, color: "#3E95CC", borderBottom: "1px solid #3E95CC" },
  },
});

export default Bits2OBSTheme;
