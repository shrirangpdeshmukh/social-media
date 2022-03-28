const express = require("express");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Post = require("../models/postModel");
const User = require("../models/userModel");

const Router = express.Router();

Router.get(
  "/",
  catchAsync(async (req, res, next) => {
    const query = req.query.search.toLowerCase();

    console.log({ query });

    const allUsers = await User.find();

    const resultUsers = allUsers.filter(
      (user) =>
        user.firstname.toLowerCase().includes(query) ||
        user.lastname.toLowerCase().includes(query)
    );
    const resultPosts = await Post.find({ tags: { $all: query } });

    res.status(200).json({
      posts: resultPosts,
      users: resultUsers,
    });
  })
);

module.exports = Router;
