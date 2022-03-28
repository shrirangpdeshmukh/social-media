const Vote = require("../models/voteModel");
const Post = require("../models/PostModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.createVote = catchAsync(async (req, res, next) => {
  const user = req.user._id;
  const postId = req.params.id;
  const post = await Post.findById(postId);

  if (!post) {
    return next(new AppError("Associated Post not found", 404));
  }

  const newVote = await Vote.create({
    createdBy: user,
    parentId: postId,
    upVote: true,
  });

  res.status(201).json({
    status: "success",
    message: "Voted created successfully",
  });
});

exports.removeVote = catchAsync(async (req, res, next) => {
  const user = req.user._id;
  const postId = req.params.id;
  const post = await Post.findById(postId);

  if (!post) {
    return next(new AppError("Associated Post not found", 404));
  }

  await Vote.findOneAndDelete({ createdBy: user, parentId: postId });

  res.status(204).json({
    status: "success",
    message: "Voted deleted successfully",
  });
});
