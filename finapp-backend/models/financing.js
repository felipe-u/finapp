const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const statusEnum = {
  AD: "Al dia",
  EM: "En mora",
  CT: "Completada",
  CP: "En cobro prejuridico",
  CJ: "En cobro juridico",
};

const financingSchema = new Schema({
  status: {
    type: String,
    enum: Object.keys(statusEnum),
    required: true,
  },
  motorcycle: {
    type: Schema.Types.ObjectId,
    ref: "Motorcycle",
  },
  initialInstallment: {
    type: Number,
    required: true,
  },
  financedAmount: {
    type: Number,
    required: true,
  },
  numberOfInstallments: {
    type: Number,
    required: true,
  },
  totalToPay: {
    type: Number,
    required: true,
  },
  monthlyInterest: {
    type: Number,
    required: true,
  },
  lateInterest: {
    type: Number,
    required: true,
  },
  installments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Installment",
    },
  ],
});

module.exports = mongoose.model("Financing", financingSchema);
