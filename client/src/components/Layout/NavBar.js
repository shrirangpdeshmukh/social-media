import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GoogleLogout } from "react-google-login";
import { Avatar, IconButton } from "@mui/material";
import {
  AddRounded,
  HomeOutlined,
  Logout,
  PersonOutlineRounded,
  SearchRounded,
} from "@mui/icons-material";

import { CLIENT_ID } from "../../constants";

const LogoutButton = ({ setLoad }) => {
  const logout = () => {
    axios
      .post("/api/auth/logout")
      .then((res) => {
        console.log(res);
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
        window.location.reload();
      });
  };

  return (
    <GoogleLogout
      clientId={CLIENT_ID}
      render={(renderProps) => {
        return (
          <IconButton
            onClick={() => {
              setLoad(true);
              renderProps.onClick();
            }}
          >
            <Logout fontSize="large" />
          </IconButton>
        );
      }}
      onLogoutSuccess={logout}
    />
  );
};

const NavBar = ({ user, setUser, setLoad, toggleDrawer }) => {
  const navigate = useNavigate();

  const navlink = window.location.pathname.split("/")[1];

  let navitems = [
    {
      path: "home",
      icon: HomeOutlined,
    },
    {
      path: "search",
      icon: SearchRounded,
    },
    {
      path: "profile",
      icon: PersonOutlineRounded,
    },
  ];

  if (user) {
    navitems.splice(2, 0, {
      path: "create",
      icon: AddRounded,
    });
  }

  return (
    <div
      style={{
        height: "100vh",
        width: "70px",
        boxShadow: "0px 0px 15px 2px rgb(140,140,140,0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      {navitems.map((item) => {
        return (
          <IconButton
            key={item.path}
            style={{ margin: "5px" }}
            onClick={() => {
              if (item.path === "search") toggleDrawer(true);
              else navigate(`/${item.path}`);
            }}
          >
            {item.path === "profile" && user ? (
              <Avatar src={user.img} />
            ) : (
              <item.icon
                fontSize="large"
                color={navlink === item.path ? "secondary" : "default"}
              />
            )}
          </IconButton>
        );
      })}

      {user && (
        <div style={{ position: "absolute", bottom: 5 }}>
          <LogoutButton setLoad={setLoad} />
        </div>
      )}
    </div>
  );
};

export default NavBar;
