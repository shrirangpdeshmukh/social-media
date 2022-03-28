import React, { useState, useEffect } from "react";
import { Box } from "@mui/system";
import {
  Grid,
  IconButton,
  Typography,
  useTheme,
  Avatar,
  Modal,
  TextareaAutosize,
  Button,
  CircularProgress
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from '@mui/icons-material/Edit';
import { Link as RouteLink } from "react-router-dom";
import axios from "axios";

import Post from "../Post/index";


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #eee',
  boxShadow: 24,
  p: 4,
};

const Profile = ({user}) => {
  user.bio = "This is profile of a software developer";
  const theme = useTheme();
  const [isLoading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setModalStatus] = useState(false);
  const [bio, setBio] = useState(user.bio);
  const [data, setData] = useState(bio);


  console.log(user);

  useEffect(() => {
    //need to change api endpoints & token
    axios.get(`http://localhost:3000/api/posts`, {
      headers: {
        "Authorization": "Bearer " + "token"
      }
    })
    .then(res => {
      isLoading(false);
      setPosts(res.data.posts);
    })
    .catch(err => {
      setLoading(false);
      if(err.response) alert(err.resonse.data);
      else alert(err.message);
    
    });
  }, []);

  const updateBio = () => {
    //need to change api endpoints & token
    axios.patch(`http://localhost:3000/user/profile`, bio, {
      headers: {
        "Authorization": "Bearer " + "token"
      }
    })
    .then(res => {
      setBio(res.data.bio);
      setData(res.data.bio);
    })
    .catch(err => {
      setData(bio);
      if(err.response) alert(err.resonse.data);
      else alert(err.message);
    });

  }

  return (
    <Box>
      <Box borderBottom="1px solid #ccc" padding="8px 20px">
        <Grid container alignItems="center">
          <Grid item sx={{ mr: "10px" }}>
            <RouteLink to="/">
              <IconButton>
                <ArrowBackIcon />
              </IconButton>
            </RouteLink>
          </Grid>

          <Grid item>
              <Typography variant="h6">
                {user?.firstname}
              </Typography>

            {!isLoading && posts && (
                <Typography sx={{ fontSize: "12px", color: "#555" }}>
                  {posts.length || 0} posts {" "}
                </Typography>
            )}
          </Grid>
        </Grid>
      </Box>

      <Grid container>
        <Grid item xs={12} md={3} mt={3} container justifyContent="center" alignItems="center"> 
            <Avatar
              alt="profile"
              src={user.img}
              sx={{ width: 120, height: 120 }}
          />
        </Grid>

        <Grid item xs={10} md={5} mt={4} mb={2} 
          container
          direction="column"
          alignItems="flex-start"
        > 
          <Typography variant="h6" sx={{ fontWeight: "500" }}>
              {user.firstname}{" "}{user.lastname}
          </Typography>
          <Typography fontSize="16px" color="#333" padding="10px 0">
              {bio}
          </Typography> 
        </Grid>

        <Grid item xs={2} md={3} md-mt={4} mt={0}
          container
          direction="column"
          alignItems="flex-end"
        > 
          <IconButton>
            <EditIcon
              onClick={() => {console.log("click"); setModalStatus(true);}}/>
          </IconButton>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={12} md={2} mt={5} ml={7}>
            <Typography
              display="inline-block"
              variant="caption"
              fontSize="16px"
              marginX="1rem"
              padding="6px 0"
              fontWeight="500"
              borderBottom={`4px solid ${theme.palette.primary.main}`}
            >
              My Posts
            </Typography>
        </Grid>

        <Grid  item xs={12} p={1} mt={3} container spacing={2}>
          {!isLoading && posts.map(post => (
              <Grid item xs={12} md={4}><Post post={post}/></Grid>
          ))}
          {isLoading && <Grid item xs={12}><CircularProgress/></Grid>}
          {!isLoading && posts.length ===0 && 
            <Grid item xs={12}>
              <Typography  variant="h6" sx={{ fontWeight: "200" }}>
                {"You do not have any posts yet !!!"}
            </Typography>

            </Grid>}
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
              <TextareaAutosize
                minRows={3}
                style={{ width: 400, border: '1px solid #eee'}}
                value={data}
                onChange={e => setData(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} mt={2} 
              container
              direction="column"
              alignItems="flex-end">
              <Button variant="contained" onClick={updateBio}>SAVE</Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </Box>
  );
}


export default Profile;