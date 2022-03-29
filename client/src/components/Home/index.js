import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Grid, CircularProgress, Box, Typography } from "@mui/material";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const getPosts = () => {
    axios
      .get("/api/posts")
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
  );
};

export default Home;
