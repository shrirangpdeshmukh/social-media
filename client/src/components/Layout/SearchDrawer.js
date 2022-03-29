import { useState, useEffect } from "react";
import {
  Grid,
  Box,
  Typography,
  Card,
  Avatar,
  Divider,
  Stack,
  ListItem,
  List,
  Button,
  Drawer,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/CloseRounded";
import { Link } from "react-router-dom";
import axios from "axios";
import DisplayPost from "../DisplayPost";

export default function SearchDrawer({ drawerOpen, drawerToggle }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ hashtags: [], users: [] });

  const search = () => {
    if (!query) {
      setResults({ hashtags: [], users: [] });
    }
    if (query) {
      let searchQuery = query;
      let isTag = false;

      if (query.includes("#") && query[0] === "#") {
        searchQuery = query.substring(1);
        isTag = true;
      }

      if (searchQuery) {
        axios
          .get(`/api/search?query=${searchQuery}&tag=${isTag}`)
          .then((res) => {
            console.log(res);
            setResults(res.data.results);
          })
          .catch((err) => console.log(err));
      }
    }
  };

  useEffect(() => {
    search();
  }, [query]);

  const handleChange = (e) => {
    e.preventDefault();
    setQuery((query) => e.target.value);
  };

  const toggleDrawer = (open) => (event) => {
    if (!open) {
      setQuery("");
    }
    drawerToggle(open);
  };

  const styles = {
    boxShadow: "0px 0px 15px 5px rgb(160,160,160,0.3)",
    margin: "1%",
    overflow: "hidden",
    height: "100%",
  };

  const list = () => (
    <Box
      sx={{
        width: { xs: "75vw", md: "40vw" },
        padding: "3%",
        boxSizing: "border-box",
      }}
    >
      <FormControl sx={{ m: 1 }} fullWidth variant="outlined">
        <InputLabel htmlFor="search">Search</InputLabel>
        <OutlinedInput
          id="search"
          value={query}
          onChange={handleChange}
          endAdornment={
            <InputAdornment position="end">
              {query ? (
                <IconButton
                  onClick={() => {
                    setQuery("");
                  }}
                >
                  <CloseIcon />
                </IconButton>
              ) : (
                <SearchIcon />
              )}
            </InputAdornment>
          }
          label="Search"
        />
      </FormControl>
      <Divider />
      <List>
        {query &&
          results.users.map((account) => {
            return (
              <ListItem key={account._id} style={styles}>
                <Box
                  style={{
                    display: "flex",
                    alignItems: "center",
                    textDecoration: "none",
                    color: "black",
                  }}
                  component={Link}
                  to={`/user/${account._id}`}
                >
                  <Avatar src={account?.img} alt={account?.firstname} />
                  <Stack direction="column" style={{ paddingLeft: "10px" }}>
                    <Typography style={{ fontWeight: 600 }}>
                      {account?.firstname} {account?.lastname}
                    </Typography>
                  </Stack>
                </Box>
              </ListItem>
            );
          })}

        {query &&
          results.hashtags.map((hashtag) => {
            return (
              <ListItem key={hashtag._id} style={styles}>
                <Box
                  style={{
                    display: "flex",
                    alignItems: "center",
                    textDecoration: "none",
                    color: "black",
                  }}
                  component={Link}
                  to={`post/tag/${hashtag.name}`}
                >
                  <Avatar>#</Avatar>
                  <Stack direction="column" style={{ paddingLeft: "10px" }}>
                    <Typography style={{ fontWeight: 600 }}>
                      {hashtag?.name}
                    </Typography>
                    <Typography style={{ fontWeight: 600, color: "blue" }}>
                      {hashtag?.associatedPosts?.length} posts
                    </Typography>
                  </Stack>
                </Box>
              </ListItem>
            );
          })}
      </List>
    </Box>
  );

  return (
    <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
      {list()}
    </Drawer>
  );
}
