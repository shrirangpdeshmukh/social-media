const express = require("express");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Post = require("../models/postModel");
const User = require("../models/userModel");
const Hashtag = require("../models/hashtagModel");

const Router = express.Router();

Router.get(
  "/",
  catchAsync(async (req, res, next) => {
    const query = req.query.query?.toLowerCase();
    const isTag = req.query.tag === "true";
    console.log({ isTag: isTag, query: query });
    const results = { hashtags: [], users: [] };

    const allHashtags = await Hashtag.find();
    results.hashtags = allHashtags.filter((hashtag) =>
      hashtag.name.includes(query)
    );
    if (!isTag) {
      const allUsers = await User.find();
      results.users = allUsers.filter(
        (user) =>
          user.firstname.toLowerCase().includes(query) ||
          user.lastname.toLowerCase().includes(query)
      );
    }
    res.status(200).json({
      results,
    });
  })
);

module.exports = Router;
