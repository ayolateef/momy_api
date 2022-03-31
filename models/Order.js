const mongoose = require("mongoose");
const { Schema } = mongoose;

const OrderSchema = new mongoose.Schema(
  {
    total_price: {
      type: String,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    order_listId: [
      {
        type: Schema.Types.ObjectId,
        ref: "OrderList",
        required: true,
      },
    ],
    order_status: {
      type: String,
      enum: ["Confirmed", "Picked up", "In progress", "Deliverd"],
    },
    Order_details: [
      {
        type: Schema.Types.ObjectId,
        ref: "OrderDetails",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
