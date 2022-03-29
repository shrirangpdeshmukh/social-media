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
          return (
            <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
              <Card
                style={{
                  boxShadow: "0px 0px 15px 5px rgb(160,160,160,0.3)",
                  margin: "2%",
                }}
                key={"post-" + index}
              >
                <Box
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "10px 20px",
                  }}
                >
                  <Avatar
                    src={post.createdBy?.img}
                    alt={post.createdBy?.firstname}
                  />
                  <Stack direction="column">
                    <Typography
                      style={{ paddingLeft: "10px", fontWeight: 600 }}
                    >
                      {post.createdBy?.firstname}
                    </Typography>
                    <Typography
                      style={{ paddingLeft: "10px", fontWeight: 600 }}
                    >
                      {new Date(post.createdAt).toLocaleString()}
                    </Typography>
                  </Stack>
                </Box>
                <Divider />
                <Box
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
              </Card>
            </Grid>
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
  );
};

export default Home;
