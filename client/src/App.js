import { useState, useEffect } from "react";
import { useRoutes } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "./App.css";

import getRoutes from "./routes.js";

const theme = createTheme({
  palette: {
    primary: {
      main: "#5B7DB1",
    },
    secondary: {
      main: "#61A4BC",
    },
    tertiary: {
      main: "#1A132F",
    },
  },
});

function App() {
  const [load, setLoad] = useState(true);
  const [user, setUser] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const updateUser = (data) => {
    setUser(data);
  };

  const updateLoad = (status) => {
    setLoad(status);
  };

  const toggleDrawer = (open) => {
    setDrawerOpen(open);
  };

  const routing = useRoutes(
    getRoutes(user, updateUser, load, updateLoad, drawerOpen, toggleDrawer)
  );

  useEffect(() => {
    console.log({ user });
  }, [user]);

  return (
    <ThemeProvider theme={theme}>
      <div className="App">{routing}</div>
    </ThemeProvider>
  );
}

export default App;
