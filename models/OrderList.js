const mongoose = require("mongoose");
const deepPopulate = require("mongoose-deep-populate")(mongoose);
const { Schema } = mongoose;

const OrderListSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
    },
    sex: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
    },
    serviceId: {
      type: Schema.Types.ObjectId,
      ref: "Services",
    },
    isActive: {
      type: Boolean,
      defaultValue: true,
    },
  },
  { timestamps: true }
);

OrderListSchema.plugin(deepPopulate);
module.exports = mongoose.model("OrderList", OrderListSchema);
