import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Avatar,
  Box,
  Card,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { ChevronLeftRounded, ChevronRightRounded } from "@mui/icons-material";

let images = [];

const ShowImage = ({ name }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
  }, [name]);

  return (
    <img
      style={{
        width: "100%",
        height: "100%",
        objectFit: "contain",
        opacity: loaded ? 1 : 0,
      }}
      src={`/api/files/${name}`}
      alt={"image-" + name}
      onLoad={() => setLoaded(true)}
    />
  );
};

const Post = ({ user }) => {
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [index, setIndex] = useState(0);

  const loadImages = () => {
    for (let i = 0; i < post.image.length; i++) {
      images[i] = document.createElement("img");
      images[i].src = "/api/files/" + post.image[i];
      images[i].onload = () => {
        console.log("loaded-" + i);
      };
    }
  };

  useEffect(() => {
    const id = window.location.pathname.split("/")[2];

    axios
      .get(`/api/posts/${id}`)
      .then((res) => {
        console.log({ post: res.data.post });

        setPost(res.data.post);
      })
      .catch((err) => {
        console.log(err);

        navigate("/home");
      });
  }, []);

  useEffect(() => {
    if (post) {
      loadImages();
    }
  }, [post]);

  return (
    <div style={{ width: "100%" }}>
      {!post ? (
        <CircularProgress />
      ) : (
        <Card style={{ boxShadow: "0px 0px 15px 5px rgb(160,160,160,0.3)" }}>
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px 20px",
            }}
          >
            <Avatar src={post.createdBy.img} alt={post.createdBy.firstname} />
            <Typography style={{ paddingLeft: "10px", fontWeight: 600 }}>
              {post.createdBy.firstname}
            </Typography>
          </Box>
          <Divider />
          <Grid container>
            <Grid item xs={12} md={6}>
              <Box
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "relative",
                }}
              >
                <Box
                  style={{
                    height: "min(80vmax, 500px)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {post && (
                    <>
                      <ShowImage name={post.image[index]} />
                      {index > 0 && (
                        <Box
                          style={{
                            position: "absolute",
                            left: 0,
                            top: 0,
                            bottom: 0,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <IconButton
                            style={{
                              backgroundColor: "rgb(200,200,200,0.5)",
                              padding: "6px",
                            }}
                            onClick={() => {
                              setIndex(index - 1);
                            }}
                          >
                            <ChevronLeftRounded />
                          </IconButton>
                        </Box>
                      )}
                    </>
                  )}
                  {index + 1 < post.image.length && (
                    <Box
                      style={{
                        position: "absolute",
                        right: 0,
                        top: 0,
                        bottom: 0,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <IconButton
                        style={{
                          backgroundColor: "rgb(200,200,200,0.5)",
                          padding: "6px",
                        }}
                        onClick={() => {
                          setIndex(index + 1);
                        }}
                      >
                        <ChevronRightRounded />
                      </IconButton>
                    </Box>
                  )}
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                style={{
                  padding: "10px",
                }}
              >
                <Box style={{ display: "flex" }}>
                  <Box style={{ padding: "0px 5px" }}>
                    <Avatar
                      src={post.createdBy.img}
                      style={{ width: "25px", height: "25px" }}
                    />
                  </Box>
                  <Box>
                    <Typography style={{ fontSize: "18px", textAlign: "left" }}>
                      <b>{post.createdBy.firstname}</b>&nbsp;{post.caption}
                    </Typography>
                  </Box>
                </Box>
                <Divider style={{ margin: "10px 0px" }} />
                {post.comments.length ? (
                  post.comments.map((comment) => (
                    <Box style={{ display: "flex" }}>
                      <Box style={{ padding: "0px 5px" }}>
                        <Avatar
                          src={comment.createdBy.img}
                          style={{ width: "25px", height: "25px" }}
                        />
                      </Box>
                      <Box>
                        <Typography
                          style={{ fontSize: "18px", textAlign: "left" }}
                        >
                          <b>{comment.createdBy.firstname}</b>&nbsp;
                          {comment.body}
                        </Typography>
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Typography>No comments on this post yet</Typography>
                )}
              </Box>
            </Grid>
          </Grid>
        </Card>
      )}
    </div>
  );
};

export default Post;
