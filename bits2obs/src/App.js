import React, { useEffect, useState, Fragment } from "react";
import { ThemeProvider } from "@material-ui/core/styles";
import config from "./config.json";

import CssBaseline from "@material-ui/core/CssBaseline";

import Bits2OBSTheme from "./helpers/Bits2OBSTheme";
import Dashboard from "./pages/Dashboard";

function App() {
  const [isTwitchConnected, setIsTwitchConnected] = useState(localStorage.getItem("twitch_access_token") !== null);
  const [isStreamlabsConnected, setIsStreamlabsConnected] = useState(localStorage.getItem("streamlabs_access_token") !== null);

  const disconnectTwitch = () => {
    localStorage.removeItem("twitch_access_token");
    localStorage.removeItem("twitch_channel_id");
    localStorage.removeItem("twitch_display_name");
    setIsTwitchConnected(false);
  };

  const disconnectStreamlabs = () => {
    localStorage.removeItem("streamlabs_access_token");
    localStorage.removeItem("streamlabs_refresh_token");
    setIsStreamlabsConnected(false);
  };

  useEffect(() => {
    const hash = document.location.hash;
    if (hash !== "" && hash.length > 1) {
      const params = new URLSearchParams(hash.substr(1));
      if (params.has("state") && params.get("state").startsWith("twitch") && params.has("access_token")) {
        localStorage.setItem("twitch_access_token", params.get("access_token"));
        setIsTwitchConnected(true);
      }
    }
    const qs = new URLSearchParams(document.location.search);
    if (qs.has("state") && qs.get("state").startsWith("streamlabs") && qs.has("code")) {
      fetch("https://bits2obs.zappatic.net/streamlabs_token.php?code=" + qs.get("code"))
        .then((response) => response.json())
        .then((data) => {
          if (data.hasOwnProperty("error")) {
            console.log("Streamlabs error", data);
          } else {
            localStorage.setItem("streamlabs_access_token", data.access_token);
            localStorage.setItem("streamlabs_refresh_token", data.refresh_token);
            setIsStreamlabsConnected(true);
          }
        });
    }

    if (localStorage.getItem("twitch_access_token") !== null) {
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
              } else {
                console.log("Failed to find an 'id' when requesting channel/user information", data);
              }

              if (data.hasOwnProperty("display_name")) {
                localStorage.setItem("twitch_display_name", data.display_name);
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

  return (
    <Fragment>
      <CssBaseline />
      <ThemeProvider theme={Bits2OBSTheme}>
        <Dashboard isTwitchConnected={isTwitchConnected} isStreamlabsConnected={isStreamlabsConnected} disconnectTwitch={disconnectTwitch} disconnectStreamlabs={disconnectStreamlabs} />
      </ThemeProvider>
    </Fragment>
  );
}

export default App;
