const express = require("express");
const postController = require("../controllers/postController");
const fileController = require("../controllers/fileController");
const Router = express.Router();

Router.get("/", postController.getAllPosts);
Router.post("/", fileController.uploadFiles, postController.createPost);
Router.delete("/", postController.deletePosts);

Router.get("/:postId", postController.getSinglePost);
Router.patch("/:postId", postController.updatePost);
Router.delete("/:postId", postController.deletePost);

module.exports = Router;
