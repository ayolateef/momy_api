const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
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
    amount: {
      type: Number,
      requried: true,
    },
    userId: {
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
    priceDetails: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Booking", BookingSchema);
