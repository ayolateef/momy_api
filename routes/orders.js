const express = require("express");

const { getOrder, getOrders, createOrder } = require("../controller/orders");

const router = express.Router();

router.get("/", getOrder);
router.get("/:id", getOrders);
router.post("/", createOrder);

module.exports = router;
