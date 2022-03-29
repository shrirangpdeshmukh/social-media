import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Avatar,
  Box,
  Button,
  Card,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Typography,
  Stack,
} from "@mui/material";
import { ChevronLeftRounded, ChevronRightRounded } from "@mui/icons-material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import moment from "moment";

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
  const [posting, setPosting] = useState(false);
  const [comment, setComment] = useState("");
  const [myLikeStatus, setLikeStatus] = useState(false);
  const [likes, setLikes] = useState(0);
  const [caption, setCaption] = useState("");

  const handleClick = () => {
    if (!myLikeStatus) {
      setLikeStatus(true);
      setLikes((prev) => prev + 1);
      axios
        .post(`/api/vote/${post._id}`)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
          alert("some error occurred!!!");
          setLikeStatus(false);
          setLikes((prev) => prev - 1);
        });
    } else {
      setLikeStatus(false);
      setLikes((prev) => prev - 1);
      axios
        .delete(`/api/vote/${post._id}`)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
          alert("some error occurred!!!");
          setLikeStatus(true);
          setLikes((prev) => prev + 1);
        });
    }
  };

  const postComment = () => {
    axios
      .post(`/api/comment/${post._id}`, { comment })
      .then(() => {
        getPost();
      })
      .catch((err) => {
        setPosting(false);
        console.log(err);
      });
  };

  const loadImages = () => {
    for (let i = 0; i < post.image.length; i++) {
      images[i] = document.createElement("img");
      images[i].src = "/api/files/" + post.image[i];
      images[i].onload = () => {
        console.log("loaded-" + i);
      };
    }
  };

  const getPost = () => {
    const id = window.location.pathname.split("/")[2];
    setPosting(true);
    axios
      .get(`/api/posts/${id}`)
      .then((res) => {
        console.log({ post: res.data.post });
        setPost(res.data.post);
        setPosting(false);
        setComment("");
      })
      .catch((err) => {
        console.log(err);

        navigate("/home");
      });
  };

  useEffect(() => {
    document.title = "Post";
    getPost();
  }, []);

  useEffect(() => {
    if (post) {
      loadImages();
      let find = post.votes.find((vote) => vote.createdBy === user._id);
      console.log(find);
      if (find) setLikeStatus(true);
      setLikes(post.votes.length);
    }
  }, [post]);

  const handleDelete = () => {
    axios
      .delete(`/api/posts/${post._id}`)
      .then((res) => {
        console.log(res);
        navigate("/profile");
      })
      .catch((err) => {
        alert(err.response.data);
        console.log(err);
      });
  };

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
            <Grid container>
              <Grid item xs={11}>
                <Box
                  style={{
                    display: "flex",
                    alignItems: "center",
                    color: "black",
                    textDecoration: "none",
                  }}
                  component={Link}
                  to={
                    user?._id === post.createdBy._id
                      ? "/profile"
                      : "/user/" + post.createdBy._id
                  }
                >
                  <Avatar
                    src={post.createdBy.img}
                    alt={post.createdBy.firstname}
                  />
                  <Typography style={{ paddingLeft: "10px", fontWeight: 600 }}>
                    {post.createdBy.firstname}
                  </Typography>
                  <Typography style={{ paddingLeft: "10px", fontWeight: 300 }}>
                    {moment(post.createdAt).fromNow()}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={1} container direction="column" alignItems="flex-end">
                {user && post && post.createdBy._id === user._id && (
                  <IconButton onClick={handleDelete}>
                    <DeleteIcon />
                  </IconButton>
                )}
              </Grid>
            </Grid>
          </Box>
          <Divider />
          <Grid container onDoubleClick={handleClick}>
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
              <Box borderTop="1px solid #ccc">
                <Grid container>
                  <Grid item ml={1}>
                    <IconButton onClick={handleClick}>
                      {!myLikeStatus && <FavoriteBorderIcon />}
                      {myLikeStatus && <FavoriteIcon color="error" />}
                    </IconButton>{" "}
                    {likes} likes
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                style={{
                  padding: "10px",
                  position: "relative",
                  height: "100%",
                  boxSizing: "border-box",
                  paddingBottom: user ? "50px" : "10px",
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
                    <Typography style={{ fontSize: "17px", textAlign: "left" }}>
                      <b>{post.createdBy.firstname}</b>
                    </Typography>
                    <Typography style={{ fontSize: "17px", textAlign: "left" }}>
                      {
                        post.caption.split(" ").map((cap, index) => {
                          if(cap[0]==='#') return <a key={index+1} href={`/post/tag/${cap.substring(1)}`}>{cap}{" "}</a>;
                          else return (cap + " ")
                        })
                      }
                    </Typography>
                  </Box>
                </Box>
                <Divider style={{ margin: "10px 0px" }} />
                <Box style={{ maxHeight: "70vw", overflow: "auto" }}>
                  {post.comments.length ? (
                    post.comments.map((comment, index) => {
                      return (
                        <Box
                          style={{
                            display: "flex",
                            height: "40px",
                            position: "relative",
                          }}
                          key={"comment-" + index}
                        >
                          <Box style={{ padding: "0px 5px" }}>
                            <Avatar
                              src={comment.createdBy.img}
                              style={{ width: "25px", height: "25px" }}
                            />
                          </Box>
                          <Box>
                            <Typography
                              style={{ fontSize: "17px", textAlign: "left" }}
                            >
                              <b>{comment.createdBy.firstname}</b>&nbsp;
                              {comment.body}
                            </Typography>
                          </Box>

                          <Box>
                            <Typography
                              style={{
                                fontSize: "12px",
                                position: "absolute",
                                right: "0",
                              }}
                            >
                              {moment(comment.createdAt).fromNow(true)}
                            </Typography>
                          </Box>
                        </Box>
                      );
                    })
                  ) : (
                    <Typography>No comments on this post yet</Typography>
                  )}
                </Box>
                {user && (
                  <Box
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 10,
                      right: 10,
                      borderTop: "1px solid rgb(200,200,200,0.5)",
                      display: "flex",
                    }}
                  >
                    <textarea
                      id="comment-box"
                      type="text"
                      readOnly={posting}
                      placeholder="Add a comment..."
                      style={{
                        width: "100%",
                        border: 0,
                        padding: "10px",
                        boxSizing: "border-box",
                        outline: "none",
                        resize: "none",
                        height: "40px",
                        fontSize: "15px",
                      }}
                      value={comment}
                      onChange={(event) => {
                        setComment(event.target.value);
                      }}
                    />
                    {posting ? (
                      <Box
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <CircularProgress
                          style={{ width: "28px", height: "28px" }}
                        />
                      </Box>
                    ) : (
                      <Button
                        style={{
                          display: comment.trim().length ? "block" : "none",
                        }}
                        onClick={() => {
                          postComment();
                        }}
                      >
                        POST
                      </Button>
                    )}
                  </Box>
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
