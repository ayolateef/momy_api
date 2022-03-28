const { builtinModules } = require("module");
const mongoose = require("mongoose");

const BookingsSchema = new mongoose.SchemaType(
  {
    title: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
    },
    schedule_date: {
      type: Date,
      required: [true, "Please add duration"],
    },
    status: {
      type: String,
      enum: ["Pending", "Ongoing", "Completed"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    OrderId: {
      type: mongoose.Schema.ObjectId,
      ref: "Order",
      required: true,
    },
    Order_details: {
      type: mongoose.Schema.ObjectId,
      ref: "OrderDetails",
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Bookings", BookingsSchema);
