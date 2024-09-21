const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const financingSchema = new Schema({
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
  status: {
    type: String,
    enum: ["al_dia", "en_mora", "completada", "cancelada", "congelada"],
    required: true,
  },
});

module.exports = mongoose.model("Financing", financingSchema);
