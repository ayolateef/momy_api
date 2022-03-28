const mongoose = require("mongoose");
const { Schema } = mongoose;

const ServicesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      enum: ["wash", "fold", "iron", "dry", "cleaning"],
    },
    orderList: {
      type: Schema.Types.ObjectId,
      ref: "OrderList",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Services", ServicesSchema);
