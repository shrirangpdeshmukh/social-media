import { Outlet } from "react-router-dom";
import { CircularProgress, Container } from "@mui/material";
import NavBar from "./NavBar";
import SearchDrawer from "./SearchDrawer";

const Layout = ({ setLoad, load, user, setUser, drawerOpen, toggleDrawer }) => {
  return (
    <div style={{ display: "flex" }}>
      <NavBar
        user={user}
        setUser={setUser}
        setLoad={setLoad}
        toggleDrawer={toggleDrawer}
      />
      <div
        style={{
          height: "100vh",
          width: "calc(100vw - 70px)",
          overflow: "auto",
        }}
      >
        {load && (
          <div
            style={{
              height: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress />
          </div>
        )}
        <Container
          style={{
            paddingTop: !load ? "20px" : "0px",
            paddingBottom: !load ? "20px" : "0px",
            boxSizing: "border-box",
            minHeight: !load ? "100vh" : "0px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <SearchDrawer drawerOpen={drawerOpen} drawerToggle={toggleDrawer} />
          <Outlet />
        </Container>
      </div>
    </div>
  );
};

export default Layout;
