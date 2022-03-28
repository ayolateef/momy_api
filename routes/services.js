const express = require("express");

const {
  getServices,
  getService,
  createServices,
  updateService,
} = require("../controller/services");

const router = express.Router();

router.get("/", getServices);
router.get("/:id", getService);
router.post("/", createServices);
router.put("/:id", updateService);

module.exports = router;
