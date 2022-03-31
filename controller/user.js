const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/User");
// const { validateUser } = require("../validation/user");

//create vendor
exports.createUser = asyncHandler(async (req, res, next) => {
  // validate input
  const user = await User.create(req.body);

  res.status(201).json({
    success: true,
    message: "User added successfully",
    data: user,
  });
});

/**
 * Get a User
 */
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorResponse(`User with ${req.params.id} is not found`, 404)
    );
  }
  return res.status(201).json({
    success: true,
    message: "User retreived successfully ",
    data: user,
  });
});
/**
 * Get all users
 */
exports.getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find({});

  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});

/**
 *Update user
 */
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(201).json({
    success: true,
    data: user,
  });
});

/**
 *Delete user
 */
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  res.status(201).json({
    success: true,
    data: {},
  });
});
