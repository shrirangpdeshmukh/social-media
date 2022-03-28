const express = require("express");
const authController = require("../controllers/authController");
const commentController = require("../controllers/commentController");

const Router = express.Router();

Router.use(authController.verifyJwtToken, authController.loggedInUser);

Router.route("/:id")
  .post(commentController.postComment)
  .delete(commentController.deleteComment);

module.exports = Router;
