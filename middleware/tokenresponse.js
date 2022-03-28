// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();
  const { _id, phone } = user;
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token: token,
    user: { _id, phone },
  });

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }
};

module.exports = sendTokenResponse;
