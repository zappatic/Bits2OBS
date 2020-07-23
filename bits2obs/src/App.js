import React, { useEffect, useState } from "react";
import { ThemeProvider } from "@material-ui/core/styles";
import config from "./config.json";

import Bits2OBSTheme from "./helpers/Bits2OBSTheme";
import LoginToTwitch from "./pages/LoginToTwitch";
import Dashboard from "./pages/Dashboard";

function App() {
  const [isLoggedIntoTwitch, setIsLoggedIntoTwitch] = useState(localStorage.getItem("twitch_access_token") !== null);

  useEffect(() => {
    console.log("executing");
    const hash = document.location.hash;
    if (hash !== "" && hash.length > 1) {
      const params = new URLSearchParams(hash.substr(1));
      if (params.has("access_token")) {
        localStorage.setItem("twitch_access_token", params.get("access_token"));
        setIsLoggedIntoTwitch(true);
      }
    }

    if (localStorage.getItem("twitch_access_token") !== null) {
      console.log("Access token present");
      const accessToken = localStorage.getItem("twitch_access_token");
      if (localStorage.getItem("twitch_channel_id") === null) {
        fetch("https://api.twitch.tv/helix/users", {
          method: "GET",
          headers: {
            Authorization: "Bearer " + accessToken,
            "Client-ID": config.twitchclientid,
          },
        })
          .then(function (res) {
            return res.json();
          })
          .then(function (json) {
            if (json.hasOwnProperty("data") && Array.isArray(json.data) && json.data.length === 1) {
              const data = json.data[0];
              if (data.hasOwnProperty("id")) {
                localStorage.setItem("twitch_channel_id", data.id);
                console.log("Retrieved channel id:", data.id);
              } else {
                console.log("Failed to find an 'id' when requesting channel/user information", data);
              }

              if (data.hasOwnProperty("display_name")) {
                localStorage.setItem("twitch_display_name", data.display_name);
                console.log("Retrieved channel display_name:", data.display_name);
              } else {
                console.log("Failed to find a 'display_name' when requesting channel/user information", data);
              }
            } else {
              console.log("Failed to interpret result when fetching channel/user information", json);
            }
          });
      }
    }
  }, []);

  return <ThemeProvider theme={Bits2OBSTheme}>{!isLoggedIntoTwitch ? <LoginToTwitch /> : <Dashboard />}</ThemeProvider>;
}

export default App;
