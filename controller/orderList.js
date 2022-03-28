const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const OrderList = require("../models/OrderList");
const { validateOrderList } = require("../validation/orderList");

/**
 * GET all Items
 */
exports.getOrdersList = asyncHandler(async (req, res, next) => {
  const ordersList = await OrderList.find({});

  return res.status(200).json({ success: true, data: ordersList });
});
/**
 *GET a single orderlist
 */
exports.getOrderList = asyncHandler(async (req, res, next) => {
  const orderList = await OrderList.findById(req.params.id).deepPopulate(
    "serviceId.orderList"
  );

  if (!orderList) {
    return next(
      new ErrorResponse(`Item not found with id of ${req.params.id}`, 404)
    );
  }
  return res.status(200).json({ success: true, data: orderList });
});

/**
 * POST ordersList
 */
exports.createOrdersList = asyncHandler(async (req, res, next) => {
  // validate input
  const { error } = validateOrderList(req.body);
  if (error) return next(new ErrorResponse(error.details[0].message, 400));

  const { name, sex, price, quantity, serviceId } = req.body;
  // create a new item
  const orderList = await OrderList.create({
    name,
    sex,
    price,
    quantity,
    serviceId,
  });
  return res.status(201).json({ success: true, data: orderList });
});

/**
 * PUT orderList
 */
exports.updateOrderList = asyncHandler(async (req, res, next) => {
  const orderList = await OrderList.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!orderList) {
    return next(
      new ErrorResponse(`Item not found with id of ${req.params.id}`, 404)
    );
  }
  return res.status(200).json({ success: true, data: orderList });
});
/**
 * Delete orderList
 */
exports.deleteOrderList = asyncHandler(async (req, res, next) => {
  const orderList = await OrderList.findByIdAndDelete(req.params.id);
  if (!orderList) {
    return next(
      new ErrorResponse(`Items not found with id of ${req.params.id}`, 404)
    );
  }
  return res.status(200).json({ success: true, data: {} });
});
