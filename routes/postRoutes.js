const express = require("express");
const postController = require("../controllers/postController");
const fileController = require("../controllers/fileController");
const authController = require("../controllers/authController");
const Router = express.Router();

Router.get("/", postController.getAllPosts);
Router.get("/tags", postController.getPostsByTag);

Router.use(authController.verifyJwtToken, authController.loggedInUser);

Router.post("/", fileController.uploadFiles, postController.createPost);

Router.get("/:postId", postController.getSinglePost);
Router.patch("/:postId", postController.updatePost);
Router.delete("/:postId", postController.deletePost);

Router.delete("/", postController.deletePosts);
module.exports = Router;
