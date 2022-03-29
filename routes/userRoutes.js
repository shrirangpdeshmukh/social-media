const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

const Router = express.Router();

Router.use(authController.verifyJwtToken, authController.loggedInUser);

Router.get("/", userController.getUser);
Router.patch("/profile", userController.addBio);

module.exports = Router;
