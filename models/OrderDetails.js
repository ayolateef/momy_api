const mongoose = require("mongoose");
const { Schema } = mongoose;

const OrderDetailsSchema = new mongoose.Schema(
  {
    total_price: {
      type: String,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["Confirmed", "Picked up", "In Progress", "Delivered"],
    },
    OrderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
    order_listId: {
      type: Schema.Types.ObjectId,
      ref: "OrderList",
    },
    quantity: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("OrderDetails", OrderDetailsSchema);
