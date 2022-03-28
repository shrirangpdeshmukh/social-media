const dotenv = require("dotenv");
dotenv.config();
const { OAuth2Client } = require("google-auth-library");

const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const client = new OAuth2Client(process.env.CLIENT_ID);

exports.verifyToken = catchAsync(async (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) return next(new AppError("User not logged in.", 403));

  client
    .verifyIdToken({ idToken: token, audience: process.env.CLIENT_ID })
    .then((res) => {
      req.user = res.payload;

      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

exports.protect = catchAsync(async (req, res, next) => {
  let user = await User.findOne({ email: req.user.email });

  if (!user) return next(new AppError("User not found", 404));
  req.user = user;

  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }

    next();
  };
};

exports.stopBlacklisted = catchAsync(async (req, res, next) => {
  if (req.user.isBlacklisted)
    return next(
      new AppError("You are blocked from performing this action", 403)
    );

  next();
});

exports.login = catchAsync(async (req, res, next) => {
  const { token } = req.body;

  if (!token) return next(new AppError("User not logged in.", 403));

  let data = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID,
  });

  let user = await User.findOne({ email: data.payload.email });

  if (!user) {
    user = await User.create({
      email: req.user.email,
      firstname: req.user.given_name,
      lastname: req.user.family_name,
      img: req.user.picture,
    });
  }

  res.cookie("jwt", req.body.token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.header("x-forwarded-proto") === "https",
  });

  res.send(user);

  // next();
});

exports.logout = catchAsync(async (req, res, next) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({ status: "success" });
});
