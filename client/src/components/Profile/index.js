import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Modal,
  Skeleton,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #eee",
  boxShadow: 24,
  p: 4,
};

const ShowImage = ({ name }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
  }, [name]);

  return (
    <>
      <img
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: loaded ? "block" : "none",
        }}
        src={`/api/files/${name}`}
        alt={"image-" + name}
        onLoad={() => setLoaded(true)}
      />
      {!loaded && (
        <Skeleton
          variant="rectangular"
          style={{ width: "100%", height: "100%", minWidth: "200px" }}
        />
      )}
    </>
  );
};

const Profile = ({ user }) => {
  const navigate = useNavigate();

  const { pathname } = useLocation();

  const theme = useTheme();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState();
  const [isModalOpen, setModalStatus] = useState(false);
  const [bio, setBio] = useState(null);
  const [data, setData] = useState(null);

  const checkUser = () => {
    const path = window.location.pathname;

    if (path.startsWith("/user/")) {
      const id = path.split("/")[2];
      if (id === user?._id) {
        navigate("/profile");

        return;
      }

      axios.get(`/api/user/${id}`).then((res) => {
        setUserData(res.data.user);
        setLoading(false);
      });
    } else setUserData(user);
  };

  useEffect(() => {
    document.title = "User";
  }, []);

  useEffect(() => {
    checkUser();
  }, [pathname]);

  useEffect(() => {
    if (userData) {
      document.title = `${userData.firstname} ${userData.lastname}`;

      if (userData.bio) {
        setBio(userData.bio);
        setData(userData.bio);
      } else {
        setBio("");
        setData("");
      }

      axios
        .get(`/api/posts/user/${userData._id}`)
        .then((res) => {
          setLoading(false);
          setPosts(res.data.posts);
        })
        .catch((err) => {
          setLoading(false);
          if (err.response) console.log(err.response.data);
          else console.log(err.message);
        });
    }
  }, [userData]);

  const updateBio = () => {
    axios
      .patch("/api/user/profile", { bio: data })
      .then((res) => {
        setModalStatus(false);
        console.log(res);
        setBio(res.data.bio);
        setData(res.data.bio);
      })
      .catch((err) => {
        setModalStatus(false);
        setData(bio);
        if (err.response) alert(err.response.data);
        else alert(err.message);
      });
  };

  return (
    <Box style={{ width: "100%" }}>
      <Grid container>
        <Grid
          item
          xs={12}
          mt={3}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Avatar
            alt="profile"
            src={userData?.img}
            sx={{ width: 120, height: 120 }}
          />
        </Grid>

        <Grid item xs={8} style={{ margin: "10px auto" }}>
          <Typography variant="h4">
            {userData?.firstname} {userData?.lastname}
          </Typography>
          <Box style={{ position: "relative" }}>
            <Typography fontSize="17px" color="#333" padding="10px 40px">
              {bio !== null ? (bio.length ? bio : "No bio added yet") : null}
            </Typography>
            {user && user?._id === userData?._id && (
              <IconButton
                style={{ position: "absolute", top: 0, right: 0 }}
                onClick={() => {
                  setModalStatus(true);
                }}
              >
                <EditIcon />
              </IconButton>
            )}
          </Box>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={12}>
          <Typography
            display="inline-block"
            variant="caption"
            fontSize="16px"
            padding="6px 0"
            fontWeight="500"
            borderBottom={`4px solid ${theme.palette.primary.main}`}
          >
            My Posts
          </Typography>
        </Grid>

        <Grid item xs={12} mt={3} container>
          {!loading &&
            posts?.map((post, index) => {
              return (
                <Box
                  key={"post-" + index}
                  style={{
                    height: "200px",
                    maxWidth: "100%",
                    overflow: "hidden",
                    margin: "10px",
                    borderRadius: "10px",
                    boxShadow: "0px 0px 10px rgba(0,0,0,0.2)",
                  }}
                  component={Link}
                  to={`/post/${post._id}`}
                >
                  <ShowImage name={post.image[0]} />
                </Box>
              );
            })}
          {loading && (
            <Grid item xs={12}>
              <CircularProgress />
            </Grid>
          )}
          {!loading && posts?.length === 0 && (
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ fontWeight: "200" }}>
                {"You do not have any posts yet !!!"}
              </Typography>
            </Grid>
          )}
        </Grid>
      </Grid>

      <Modal
        open={isModalOpen}
        onClose={() => setModalStatus(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Grid container>
            <Grid item xs={12}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Edit Bio
              </Typography>
            </Grid>
            <Grid item xs={12} mt={2}>
              <TextField
                multiline
                rows={4}
                style={{ width: 400, border: "1px solid #eee" }}
                value={data}
                onChange={(e) => setData(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} mt={2} container alignItems="flex-end">
              <Button variant="contained" onClick={updateBio}>
                SAVE
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </Box>
  );
};

export default Profile;
