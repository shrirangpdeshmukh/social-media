import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Modal,
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

const Profile = ({ user }) => {
  const navigate = useNavigate();

  // user.bio = "This is profile of a software developer";
  const theme = useTheme();
  const [isLoading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setModalStatus] = useState(false);
  const [bio, setBio] = useState(user.bio ? user.bio : "No bio added yet");
  const [data, setData] = useState(bio);

  useEffect(() => {
    //need to change api endpoints & token
    axios
      .get("/api/posts/")
      .then((res) => {
        setLoading(false);
        setPosts(res.data.posts);
      })
      .catch((err) => {
        setLoading(false);
        if (err.response) console.log(err.response.data);
        else console.log(err.message);
      });
  }, []);

  const updateBio = () => {
    //need to change api endpoints & token
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
            src={user.img}
            sx={{ width: 120, height: 120 }}
          />
        </Grid>

        <Grid item xs={8} style={{ margin: "10px auto" }}>
          <Typography variant="h4">
            {user.firstname} {user.lastname}
          </Typography>
          <Box style={{ position: "relative" }}>
            <Typography fontSize="17px" color="#333" padding="10px 40px">
              {bio}
            </Typography>
            <IconButton
              style={{ position: "absolute", top: 0, right: 0 }}
              onClick={() => {
                setModalStatus(true);
              }}
            >
              <EditIcon />
            </IconButton>
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
          {!isLoading &&
            posts.map((post, index) => {
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
                  <img
                    src={"/api/files/" + post.image[0]}
                    alt={"post-image-" + index}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              );
            })}
          {isLoading && (
            <Grid item xs={12}>
              <CircularProgress />
            </Grid>
          )}
          {!isLoading && posts.length === 0 && (
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
            <Grid
              item
              xs={12}
              mt={2}
              container
              direction="column"
              alignItems="flex-end"
            >
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
