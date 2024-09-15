const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const fundingStatusSchema = new Schema({
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
  product: {
    type: String,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("FundingStatus", fundingStatusSchema);