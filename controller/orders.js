const Order = require("../models/Order");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/User");
const OrderDetails = require("../models/OrderDetails");
const OrderList = require("../models/OrderList");
const { validateOrder } = require("../validation/order");

/**
 * GET all orders
 */
exports.getOrders = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;
  const orders = await Order.find({ userId });

  return res.status(200).json({ success: true, data: orders });
});

/**
 * GET an order
 */
exports.getOrder = asyncHandler(async (req, res, next) => {
  const order = await OrderDetails.find({
    orderId: req.params.id,
  }).deepPopulate("order_details.order_list");

  if (!order) {
    return next(
      new ErrorResponse(`Order not found with id of ${req.params.id}`, 404)
    );
  }
  return res.status(200).json({ success: true, data: order });
});

/**
 * POST an order
 */
exports.createOrder = asyncHandler(async (req, res, next) => {
  // validate input
  const { error } = validateOrder(req.body);
  if (error)
    return res
      .status(400)
      .send({ success: false, messgae: error.details[0].message });

  const { userId, orderslistId } = req.body;
  //map orderlist to it ids
  const ids = orderslistId.map((orderlist) => orderlist.id);

  //Get all selected items
  const items = await OrderList.find({ _id: ids });
  //getting the totalprice and summing the orderlist
  const totalPrice = items.reduce((a, b) => a + b.price, 0);

  // Creating an order
  const order = await Order.create({
    userId,
    total_price: totalPrice,
  });
  console.log("order created", order);

  //mapping order id to order details
  const mappedOrderDetail = await orderslistId.map((orderlist) => ({
    orderId: order._id,
    orderlistId: orderlist.id,
    quantity: orderlist.qty,
  }));
  const orderDetails = await OrderDetails.insertMany(mappedOrderDetail);

  return res.status(201).json({ success: true, data: orderDetails });
});
