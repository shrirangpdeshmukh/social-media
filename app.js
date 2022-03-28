const express = require("express");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const path = require("path");
const app = express();

const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const fileRoutes = require("./routes/fileRoutes");
const commentRoutes = require("./routes/commentRoutes");
const voteRoutes = require("./routes/voteRoutes");
const userRoutes = require("./routes/userRoutes");
const searchRoute = require("./routes/searchRoute");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const morganMiddleware = require("./utils/requestLogger");

app.use(express.json({ limit: "10kb" }));
app.use(morganMiddleware);

app.use(cookieParser());
app.use(mongoSanitize());
app.enable("trust proxy");
app.use(express.static(path.join(__dirname, "/client/build")));

app.get("/api/health", (req, res, next) => {
  res.send("Health Check is working fine!");
});

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/search", searchRoute);
app.use("/api/user", userRoutes);
app.use("/api/vote", voteRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/files", fileRoutes);

app.all("*", async (req, res, next) => {
  if (req.originalUrl.startsWith("/api")) {
    return next(
      new AppError(`Can't find ${req.originalUrl} on this server!`, 404)
    );
  }
  res.sendFile(path.join(__dirname, "/client/build/index.html"));
});

app.use(globalErrorHandler);

module.exports = app;
