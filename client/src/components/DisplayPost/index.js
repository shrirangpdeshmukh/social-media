import {
  Grid,
  Box,
  Typography,
  Card,
  Avatar,
  Divider,
  Stack,
} from "@mui/material";
import { Link } from "react-router-dom";

const styles = {
  boxShadow: "0px 0px 15px 5px rgb(160,160,160,0.3)",
  margin: "2%",
  height: "300px",
  overflow: "hidden",
};

const DisplayPost = ({ post }) => {
  return (
    <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
      <Card style={styles} sx={{ height: "100%", ...styles }}>
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            padding: "10px 20px",
          }}
        >
          <Avatar src={post.createdBy?.img} alt={post.createdBy?.firstname} />
          <Stack direction="column">
            <Typography style={{ paddingLeft: "10px", fontWeight: 600 }}>
              {post.createdBy?.firstname}
            </Typography>
            <Typography style={{ paddingLeft: "10px", fontWeight: 600 }}>
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
            alt={"post-image"}
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
};

export default DisplayPost;
