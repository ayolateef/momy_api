const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Vendor = require("../models/Vendor");
const sendEmail = require("../utils/sendEmail");
const sendTokenResponse = require("../middleware/tokenresponse");
const crypto = require("crypto");
const { validateVendor } = require("../validation/vendor");

//create vendor
exports.createVendor = asyncHandler(async (req, res, next) => {
  // validate input
  const { error } = validateVendor(req.body);
  if (error) return next(new ErrorResponse(error.details[0].message, 400));

  const { name, email, password } = req.body;

  let vendor = await Vendor.findOne({ email }).select("password");
  if (vendor) return next(new ErrorResponse("Vendor exists already", 400));

  vendor = new Vendor({
    name,
    email,
    password,
  });

  await vendor.save();

  // TODO: initiate admin password reset and send email to admin
  const token = await vendor.getResetPasswordToken();

  // TODO: send token to admin email to reset password

  res.status(201).json({
    success: true,
    message: "Vendor added successfully",
    data: vendor,
  });
});

/**
 * Get a vendor
 */
exports.getVendor = asyncHandler(async (req, res, next) => {
  const vendor = await Vendor.findById(req.params.id);

  if (!vendor) {
    return next(
      new ErrorResponse(`Vendor with ${req.params.id} is not found`, 404)
    );
  }
  return res.status(201).json({
    success: true,
    message: "Vendor retreived successfully ",
    data: vendor,
  });
});
/**
 * Get all vendors
 */
exports.getVendors = asyncHandler(async (req, res, next) => {
  const vendors = await Vendor.find({});

  res.status(200).json({
    success: true,
    count: vendors.length,
    data: vendors,
  });
});
