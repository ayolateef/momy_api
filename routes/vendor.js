const express = require("express");

const { createVendor, getVendor, getVendors } = require("../controller/vendor");

const router = express.Router();

router.post("/", createVendor);
router.get("/:id", getVendor);
router.get("/", getVendors);

module.exports = router;
