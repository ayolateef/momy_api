const Order = require("../models/Order");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const OrderList = require("../models/OrderList");
const Services = require("../models/Services");
const { validateService } = require("../validation/service");
const { truncate } = require("fs");

/**
 * GET all Services
 */
exports.getServices = asyncHandler(async (req, res, next) => {
  const services = await Services.find().populate("orderList");

  return res.status(200).json({ success: true, data: services });
});
/**
 * GET a service
 */
exports.getService = asyncHandler(async (req, res, next) => {
  const service = await Services.findById(req.params.id).populate("orderList");
  if (!service) {
    return next(
      new ErrorResponse(`Item not found with id of ${req.params.id}`, 404)
    );
  }
  return res.status(200).json({ success: true, data: service });
});

/**
 * POST a service
 */
exports.createServices = asyncHandler(async (req, res, next) => {
  //validate input
  const { error } = validateService(req.body);
  if (error) return next(new ErrorResponse(error.details[0].message, 400));

  const { name, title } = req.body;

  const service = await Services.create({
    name,
    title,
  });

  return res.status(201).json({ success: true, data: service });
});

/**
 * UPDATE service
 */
exports.updateService = asyncHandler(async (req, res, next) => {
  const service = await Services.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!service) {
    return next(
      new ErrorResponse(`Item not found with id of ${req.params.id}`, 404)
    );
  }
  return res.status(200).json({ success: true, data: service });
});
