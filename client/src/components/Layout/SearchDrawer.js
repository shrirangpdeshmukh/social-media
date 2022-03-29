// import { useEffect, useState } from "react";
// import axios from "axios";
// import { Grid, Typography } from "@mui/material";
// import DisplayPost from "../DisplayPost";
// import DisplayUser from "../DisplayUser";
// import DemoDrawer from "../DemoDrawer/DummyDrawer";

// const Search = () => {
//   const [query, setQuery] = useState("");
//   const [results, setResults] = useState({ posts: [], users: [] });

//   const search = () => {
//     if (query) {
//       axios
//         .get(`/api/search?search=${query}`)
//         .then((res) => {
//           console.log(res);
//           setResults(res.data);
//         })
//         .catch((err) => console.log(err));
//     }
//   };

//   useEffect(() => {
//     search();
//   }, [query]);

//   const handleChange = (e) => {
//     e.preventDefault();
//     setQuery((query) => e.target.value);
//   };

//   return (
//     <>
//       <div>SEARCH</div>
//       {/* <input
//         type="text"
//         value={query}
//         placeholder="search"
//         onChange={handleChange}
//       /> */}
//       <DemoDrawer />
//       {/* <Grid container spacing={2}>
//         <Grid container item xs={12}>
//           {results.users.length > 0 && (
//             <Typography variant="h6" sx={{ fontWeight: "200" }}>
//               {"Matching users"}
//             </Typography>
//           )}
//           {results.users.map((user) => {
//             return <DisplayUser account={user} key={user._id} />;
//           })}
//         </Grid>
//         <Grid container item xs={12}>
//           {results.posts.length > 0 && (
//             <Typography variant="h6" sx={{ fontWeight: "200" }}>
//               {"Mtching posts"}
//             </Typography>
//           )}
//           {results.posts.map((post, index) => {
//             return <DisplayPost post={post} key={"post-" + index} />;
//           })}
//         </Grid>{" "}
//         {query && results.posts.length === 0 && results.users.length === 0 && (
//           <Grid item xs={12}>
//             <Typography variant="h6" sx={{ fontWeight: "200" }}>
//               {"No matching users or hastags found for your query!!!"}
//             </Typography>
//           </Grid>
//         )}
//       </Grid> */}
//     </>
//   );
// };

// export default Search;

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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";
import axios from "axios";
import DisplayPost from "../DisplayPost";

export default function SearchDrawer({ drawerOpen, drawerToggle }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ posts: [], users: [] });

  const search = () => {
    if (query) {
      axios
        .get(`/api/search?search=${query}`)
        .then((res) => {
          console.log(res);
          setResults(res.data);
        })
        .catch((err) => console.log(err));
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
              <SearchIcon />
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
                  }}
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
          results.posts.map((post) => {
            return <DisplayPost post={post} />;
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
