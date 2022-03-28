const express = require("express");

const {
  getOrdersList,
  getOrderList,
  createOrdersList,
  updateOrderList,
  deleteOrderList,
} = require("../controller/orderList");

const router = express.Router();

router.get("/", getOrdersList);
router.get("/:id", getOrderList);
router.post("/", createOrdersList);
router.put("/:id", updateOrderList);
router.delete("/:id", deleteOrderList);

module.exports = router;
