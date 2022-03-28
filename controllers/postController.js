const config = require("../utils/config");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const Posts = require("../models/postModel");

//controller for GET requests on /posts endpoint
exports.getAllPosts = catchAsync(async (req, res, next) => {
  let posts = await Posts.find({ createdBy: req.user._id })
    .populate([
      {
        path: "createdBy",
      },
      {
        path: "votes",
      },
      {
        path: "comments",
      },
    ])
    .sort({ timestamp: -1 });
  res.status(200).json({
    status: "success",
    posts,
  });
});

//controller for POST requests on /posts endpoint
exports.createPost = catchAsync(async (req, res, next) => {
  const data = JSON.parse(JSON.stringify(req.body));
  const files = [];
  console.log(req.files);
  if (req.files) {
    req.files.forEach((file) => {
      files.push(file.filename);
    });
  }

  data.image = files;
  let caption = data.caption.split(" ");
  let tagList = caption.filter((word) => word[0] === "#");
  console.log(tagList);
  let tags = [];

  for (let ele of tagList) {
    let t = ele.split("#").filter((word) => word.length > 0);
    console.log(t);
    tags = tags.concat(t);
  }
  data.tags = tags;

  let post = await Posts.create(data);
  res.status(201).json({
    status: "success",
    post,
  });
});

//controller for DELETE requests on /posts endpoint
exports.deletePosts = catchAsync(async (req, res, next) => {
  const posts = await Posts.remove({});

  if (!posts) {
    return next(
      new AppError(`No post found with id ${req.params.postId}`, 404)
    );
  }

  res.json({
    status: "success",
    posts: null,
  });
});

//controller for GET requests on /posts/:postId endpoint
exports.getSinglePost = catchAsync(async (req, res, next) => {
  var post = await Posts.findOne({ _id: req.params.postId });

  if (!post) {
    return next(
      new AppError(`No post found with id ${req.params.postId}`, 404)
    );
  }

  res.status(200).json({
    status: "success",
    post,
  });
});

//controller for PATCH requests on /posts/:postId endpoint
exports.updatePost = catchAsync(async (req, res, next) => {
  const data = JSON.parse(JSON.stringify(req.body));
  console.log(req.file);

  if (req.file) {
    data.url = config.serverUrl + req.file.filename;
  }
  console.log(data);

  let modifiedPost = await Posts.findByIdAndUpdate(
    req.params.postId,
    {
      $set: data,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!modifiedPost) {
    return next(
      new AppError(`No post found with id ${req.params.postId}`, 404)
    );
  }

  res.status(200).json({
    status: "success",
    modifiedPost,
  });
});

//controller for DELETE requests on /posts/:postId endpoint
exports.deletePost = catchAsync(async (req, res, next) => {
  const post = await Posts.findByIdAndDelete(req.params.postId);

  if (!post) {
    return next(
      new AppError(`No post found with id ${req.params.postId}`, 404)
    );
  }

  res.json({
    status: "success",
    post: null,
  });
});
