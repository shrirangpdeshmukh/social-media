const express = require("express");
const postController = require("../controllers/postController");
const fileController = require("../controllers/fileController");
const authController = require("../controllers/authController");
const Router = express.Router();

Router.get("/all", postController.getAllPosts);
Router.get("/tags", postController.getPostsByTag);
Router.get("/:postId", postController.getPost);
Router.get("/user/:id", postController.getUserPosts);

Router.use(authController.verifyJwtToken, authController.loggedInUser);

Router.post(
  "/",
  fileController.multerUpload,
  fileController.resizeAndUploadFiles,
  postController.createPost
);
Router.get("/", postController.getMyPosts);

Router.patch("/:postId", postController.updatePost);
Router.delete("/:postId", postController.deletePost);

Router.delete("/", postController.deletePosts);
module.exports = Router;
