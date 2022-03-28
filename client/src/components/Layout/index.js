import { Outlet } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import NavBar from "./NavBar";

const Layout = ({ setLoad, load, user, setUser }) => {
  return (
    <div style={{ display: "flex" }}>
      <NavBar user={user} setUser={setUser} setLoad={setLoad} />
      <div
        style={{
          borderRadius: "10px",
          height: "100vh",
          flex: "1",
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
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
