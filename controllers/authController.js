const { OAuth2Client } = require("google-auth-library");
const { promisify } = require("util");
const config = require("../utils/config");
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const client = new OAuth2Client(config.CLIENT_ID);

const createToken = (id, role) => {
  const jwtToken = jwt.sign({ id, role }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN,
  });
  return jwtToken;
};

exports.verifyJwtToken = catchAsync(async (req, res, next) => {
  // 1) Getting token and check ff it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }
  // 2) Verifying token
  const decoded = await promisify(jwt.verify)(token, config.JWT_SECRET);

  req.jwtPayload = {
    id: decoded.id,
    role: decoded.role,
  };
  next();
});

exports.loggedInUser = catchAsync(async (req, res, next) => {
  const currentUser = await User.findById(req.jwtPayload.id);
  if (!currentUser) {
    return next(new AppError("User not found", 401));
  }
  req.user = currentUser;
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

exports.login = catchAsync(async (req, res, next) => {
  const { token } = req.body;

  if (!token) return next(new AppError("User not logged in.", 403));

  let data = await client.verifyIdToken({
    idToken: token,
    audience: config.CLIENT_ID,
  });

  const { given_name, family_name, email, picture } = data.payload;

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      email,
      firstname: given_name,
      lastname: family_name,
      img: picture,
    });
  }

  const jwtToken = createToken(user._id, user.role);
  const expireAt = new Date(
    Date.now() + config.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
  );
  const cookieOptions = {
    expires: expireAt,
    httpOnly: true,
    secure: config.NODE_ENV === "production",
  };

  res.cookie("jwt", jwtToken, cookieOptions);
  res.send(user);
});

exports.logout = catchAsync(async (req, res, next) => {
  res.clearCookie("jwt", {
    path: "/",
  });

  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
});
