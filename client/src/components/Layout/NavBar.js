import { useNavigate } from "react-router-dom";
import { Avatar, IconButton } from "@mui/material";
import {
  HomeOutlined,
  PersonOutlineRounded,
  SearchRounded,
} from "@mui/icons-material";

const NavBar = ({ user, setUser }) => {
  const navigate = useNavigate();

  const navlink = window.location.pathname.split("/")[1];

  const navitems = [
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
              navigate(`/${item.path}`);
            }}
          >
            {item.path === "profile" && user ? (
              <Avatar src={user.img} />
            ) : (
              <item.icon
                fontSize="large"
                color={navlink === item.path ? "primary" : "default"}
              />
            )}
          </IconButton>
        );
      })}
    </div>
  );
};

export default NavBar;
