const express = require("express");
const authController = require("../controllers/authController");
const voteController = require("../controllers/voteController");

const Router = express.Router();

Router.use(authController.verifyJwtToken, authController.loggedInUser);

Router.route("/:id")
  .post(voteController.createVote)
  .delete(voteController.removeVote);

module.exports = Router;
