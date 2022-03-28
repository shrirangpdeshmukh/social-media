import { Navigate } from "react-router-dom";
import { Create, Home, Layout, Login, Profile, Search } from "./components";

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
          { path: "/profile", element: <Profile user={user}/> },
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
            path: "/home",
            element: <Login setUser={setUser} setLoad={setLoad} />,
          },
          {
            path: "/search",
            element: <Login setUser={setUser} setLoad={setLoad} />,
          },
          {
            path: "/profile",
            element: <Login setUser={setUser} setLoad={setLoad} />,
          },
          {
            path: "/create",
            element: <Login setUser={setUser} setLoad={setLoad} />,
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
