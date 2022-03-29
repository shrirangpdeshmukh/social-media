import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Grid,
  CircularProgress,
  Box,
  Typography,
  Card,
  Avatar,
  Divider,
  Stack,
} from "@mui/material";
import DisplayPost from "../DisplayPost";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const getPosts = () => {
    axios
      .get("/api/posts/all")
      .then((response) => {
        setLoading(false);
        console.log(response);
        setPosts(response.data.posts);
      })
      .catch((error) => {
        setLoading(false);

        console.log(error);
      });
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <Grid container>
      {!isLoading &&
        posts.map((post, index) => {
          return <DisplayPost post={post} key={"post-" + index} />;
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
  );
};

export default Home;
