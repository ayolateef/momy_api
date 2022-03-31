const express = require("express");

const { createBooking } = require("../controller/booking");

const router = express.Router();

router.post("/", createBooking);

module.exports = router;
