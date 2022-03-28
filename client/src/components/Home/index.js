import { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
  const [posts, setPosts] = useState([]);

  const getPosts = () => {
    axios
      .get("/api/posts")
      .then((response) => {
        console.log(response);
        setPosts(response.data.posts);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getPosts();
  }, []);

  return <div>HOME</div>;
};

export default Home;
