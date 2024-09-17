const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const financingStatusSchema = new Schema({
  installments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Installment",
    },
  ],
  installmentsQuantity: {
    type: Number,
    required: true,
  },
  initialInstallment: {
    type: Number,
    required: true,
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },
  totalPrice: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("FinancingStatus", financingStatusSchema);
