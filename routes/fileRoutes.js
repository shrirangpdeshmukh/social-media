const express = require("express");
const fileController = require("../controllers/fileController");
const Router = express.Router();

Router.get("/:filename", fileController.getFile);

// Router.use(authController.verifyJwtToken, authController.loggedInUser);

module.exports = Router;
