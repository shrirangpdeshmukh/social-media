const config = require("../utils/config");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const Posts = require("../models/postModel");
const Hashtag = require("../models/hashtagModel");

const popOptions = [
  {
    path: "createdBy",
    select: "firstname lastname img",
  },
  {
    path: "votes",
    select: "createdBy",
  },
  {
    path: "comments",
    populate: {
      path: "createdBy",
      select: "firstname lastname img",
    },
  },
];

//controller for GET requests on /posts/all endpoint
exports.getAllPosts = catchAsync(async (req, res, next) => {
  let posts = await Posts.find().populate(popOptions).sort({ timestamp: -1 });
  res.status(200).json({
    status: "success",
    results: posts.length,
    posts,
  });
});

//controller for GET requests on /posts endpoint
exports.getMyPosts = catchAsync(async (req, res, next) => {
  let posts = await Posts.find({ createdBy: req.user._id })
    .populate(popOptions)
    .sort({ createdAt: -1 });
  res.status(200).json({
    status: "success",
    results: posts.length,
    posts,
  });
});

//controller for POST requests on /posts endpoint
exports.createPost = catchAsync(async (req, res, next) => {
  const data = JSON.parse(JSON.stringify(req.body));
  let post = new Posts();
  const files = [];
  console.log(req.files);
  if (req.files) {
    req.files.forEach((file) => {
      files.push(file.filename);
    });
  }

  let caption = data.caption.toLowerCase().split(" ");
  let tagList = caption.filter((word) => word[0] === "#");
  console.log(tagList);
  let tags = [];

  for (let ele of tagList) {
    let t = ele.split("#").filter((word) => word.length > 0);
    console.log(t);
    tags = tags.concat(t);
  }

  for (let tag of tags) {
    const tagDocument = await Hashtag.findOne({ name: tag });

    if (tagDocument) {
      console.log("documment already exists");
      tagDocument.associatedPosts.push(post._id);
      await tagDocument.save();
    } else {
      console.log("document doesnot exist createc new one");
      await Hashtag.create({ name: tag, associatedPosts: [post._id] });
    }
  }

  post.caption = data.caption;
  post.tags = tags;
  post.image = files;
  post.createdBy = req.user?._id;

  await post.save();

  res.status(201).json({
    status: "success",
    post,
  });
});

//controller for DELETE requests on /posts endpoint
exports.deletePosts = catchAsync(async (req, res, next) => {
  const posts = await Posts.remove({ createdBy: req.user._id });

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
exports.getPost = catchAsync(async (req, res, next) => {
  var post = await Posts.findOne({
    _id: req.params.postId,
  }).populate(popOptions);

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
  if (req.body.image) {
    return next(new AppError("files can't be updated", 403));
  }

  let modifiedPost = await Posts.findOneAndUpdate(
    {
      _id: req.params.postId,
      createdBy: req.user._id,
    },
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
  const post = await Posts.findByOneAndDelete({
    _id: req.params.postId,
    createdBy: req.user._id,
  });

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

exports.getPostsByTag = catchAsync(async (req, res, next) => {
  const query = req.query.search.toLowerCase();

  const posts = await Posts.find({ tags: { $all: query } }).populate(
    popOptions
  );

  res.status(200).json({
    status: "success",
    results: posts.length,
    posts,
  });
});
