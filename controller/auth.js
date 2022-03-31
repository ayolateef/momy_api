const path = require("path");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const sendTokenResponse = require("../middleware/tokenresponse");
const {
  validateLogin,
  validateSignUp,
} = require("../validation/authValidation");
const crypto = require("crypto");

// const DEFAULT_PASSWORD = "24trwYY32243T3YU";

exports.signup = asyncHandler(async (req, res, next) => {
  const { error } = validateSignUp(req.body);
  if (error) return next(new ErrorResponse(error.details[0].message, 400));

  const { name, email, password, phone } = req.body;
  //ceck duplicate
  let user = await User.findOne({ phone });
  if (user) {
    return next(new ErrorResponse("user already exist", 401));
  }
  //Create user
  user = new User({
    name,
    email,
    password,
    phone,
  });

  await user.save();

  sendTokenResponse(user, 201, res);
});

/**
 * Phone Number Verification
 */
exports.verifyPhoneNum = asyncHandler(async (req, res, next) => {
  const { phone } = req.body;

  const user = await User.findOne({ phone });
  // check if user with phone num exist
  if (!user) {
    return next(new ErrorResponse("user with phone number already exist", 400));
  }
  res.status(201).json({
    success: true,
    message: "OTP sended to your registered phone number",
    data: { userId: user._id },
  });
});

/**
 * Login user
 */
exports.login = asyncHandler(async (req, res, next) => {
  //validate login
  const { error } = validateLogin(req.body);
  if (error) return next(new ErrorResponse(error.details[0].message, 400));

  // check if user exist
  const user = await User.findOne({ phone: req.body.phone }).select("password");
  console.log(user);

  if (!user) {
    return next(new ErrorResponse("Invalid phone number or password", 400));
  }
  // check if password is correct
  const isPassword = await user.matchPassword(req.body.password);
  if (!isPassword)
    return next(new ErrorResponse("Invalid phone number or password ", 400));

  //generate a token for the user
  sendTokenResponse(user, 200, res);
});

/**
 * Logout user
 */
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httponly: true,
  });
  res.status(200).json({
    success: true,
    data: {},
  });
});

/**
 * Password Recovery
 */
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse("There is no user with that email", 404));
  }
  //Get reset token
  const resetToken = user.getResetPasswordToken();
  console.log(resetToken);
  await user.save({ validateBeforeSave: false });

  // create reset url
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/resetPassword/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password reset token",
      message,
    });
    res.status(200).json({ success: true, data: "Email sent" });
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse("Email couldnot be sent", 500));
  }
  res.status(200).json({
    success: true,
    data: user,
  });
});
/**
 * Reset password
 */
exports.resetPassword = asyncHandler(async (req, res, next) => {
  //Get hashed token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resettoken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $lte: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse("Invalid token", 400));
  }
  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);
});
/**
 * upload documents
 */
exports.uploadDocuments = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorResponse(`User not found wit id of ${req.params.id}`, 404)
    );
  }
  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }
  const file = req.files.file;
  //make sure its a file
  if (!file.mimetype.startWith("doc")) {
    return next(new ErrorResponse(`Please upload a doctype file`, 400));
  }
  //check filesize
  if (file.size > MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload a file less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }
  // Create custom filename
  file.name = `doc_${service._id} }${path.parse(file.name).ext} `;
  //upload the file
  file.mv(`${process.env.FILE_UPLOAD}/${file.name}`, async (err) => {
    if (err) {
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }
    // insert the filename into the db
    await Service.findByIdAndUpdate(req.params.id, { document: file.name });

    res.status(200).json({ success: true, data: file.name });
  });
});

/**
 * Update user details
 */
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
  };

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: {},
  });
});

/**
 * Update user password
 */
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("password");

  //Check current passord
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse("Password is incorrect", 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});
