import { useEffect, useState } from "react";
import axios from "axios";

const Search = () => {
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

  return (
    <>
      <div>SEARCH</div>
      <input
        type="text"
        value={query}
        placeholder="search"
        onChange={handleChange}
      />
      {results.posts.map((post) => {
        return (
          <div>
            <span>{post.caption}</span>
            <br />
            {post.image.forEach((i) => {
              return <p>{post.i}</p>;
            })}
            <div>{post.createdAt}</div>
            <div>{post.createdBy?.firstName}</div>
          </div>
        );
      })}

      {results.users.map((user) => {
        return (
          <div>
            <span>{user.firstname}</span>
            <span>{user.lastname}</span>
          </div>
        );
      })}
    </>
  );
};

export default Search;
