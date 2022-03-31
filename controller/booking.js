const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const sendEmail = require("../utils/sendEmail");
const User = require("../models/User");
const Booking = require("../models/Booking");
const Order = require("../models/Order");
const Vendor = require("../models/Vendor");
const Service = require("../models/Services");
const OrderDetails = require("../models/OrderDetails");

/**
 * Create booking
 */
exports.createBooking = asyncHandler(async (req, res, next) => {
  const service = await Service.findById(req.params.serviceId);

  if (!service) {
    return next(
      new ErrorResponse(
        `Service with the ID ${req.params.serviceId} not found`,
        404
      )
    );
  }
  // search for vendor
  const vendor = await Vendor.findById(req.body.vendorId);

  // add body fields
  req.body.user = req.body.user ? req.body.user : req.user.id;

  req.body.schedule_date = service.schedule_date;
  req.body.amount = req.body.amount;
  req.body.service = req.params.serviceId;
  req.body.address = req.body.address ? req.body.address : req.user.address;

  const booking = await Booking.create(req.body);

  //retrieve services & orderId from booking
  const details = await OrderDetails.find(booking._id);

  //create confirm url
  const bookingURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/bookings/:id/status`;
  const message = `You are receiving`;

  await sendEmail({
    email: vendor.email,
    service: "Session Booking",
    message,
  });

  res.status(201).json({
    success: true,
    data: details,
  });
});
