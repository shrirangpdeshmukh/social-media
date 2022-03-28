import { Navigate } from "react-router-dom";
import {
  Create,
  Home,
  Layout,
  Login,
  Post,
  Profile,
  Search,
} from "./components";

const getRoutes = (user, setUser, load, setLoad) => {
  if (user)
    return [
      {
        path: "/",
        element: (
          <Layout load={load} setLoad={setLoad} setUser={setUser} user={user} />
        ),
        children: [
          { path: "/home", element: <Home /> },
          { path: "/search", element: <Search /> },
          { path: "/create", element: <Create /> },
          { path: "/post/:id", element: <Post user={user} /> },
          { path: "/profile", element: <Profile user={user} /> },
          { path: "/", element: <Navigate to="/home" replace /> },
          { path: "*", element: <Navigate to="/home" replace /> },
        ],
      },
    ];

  if (load)
    return [
      {
        path: "/",
        element: (
          <Layout load={load} setLoad={setLoad} setUser={setUser} user={user} />
        ),
        children: [
          {
            path: "*",
            element: <Login setUser={setUser} load={load} setLoad={setLoad} />,
          },
          {
            path: "/",
            element: <Login setUser={setUser} load={load} setLoad={setLoad} />,
          },
        ],
      },
    ];

  return [
    {
      path: "/",
      element: <Layout load={load} setUser={setUser} user={user} />,
      children: [
        {
          path: "/home",
          element: <Home />,
        },
        {
          path: "/search",
          element: <Search />,
        },
        {
          path: "/post/:id",
          element: <Post />,
        },
        {
          path: "/profile",
          element: <Navigate to="/login" replace />,
        },
        {
          path: "/login",
          element: <Login setUser={setUser} setLoad={setLoad} />,
        },
        { path: "/", element: <Navigate to="/home" replace /> },
        { path: "*", element: <Navigate to="/home" replace /> },
      ],
    },
  ];
};

export default getRoutes;
