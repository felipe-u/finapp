const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const statusEnum = {
  AL_DIA: "Al dia",
  EN_MORA: "En mora",
  COMPL: "Completada",
  PREJU: "En cobro prejuridico",
  JURID: "En cobro juridico",
};

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
    enum: Object.keys(statusEnum),
    required: true,
  },
});

module.exports = mongoose.model("Financing", financingSchema);
