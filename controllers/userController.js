const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getUser = catchAsync(async (req, res, next) => {
  const user = req.user;

  if (!user) {
    return next(new AppError("User not found", 400));
  }

  res.status(200).json({
    user,
  });
});

exports.addBio = catchAsync(async (req, res, next) => {
  const user = req.user._id;
  const { bio } = req.body;

  const updatedUser = await User.findByIdAndUpdate(user, { bio: bio });

  res.status(200).json({
    status: "success",
    message: "Bio updated successfully",
  });
});
