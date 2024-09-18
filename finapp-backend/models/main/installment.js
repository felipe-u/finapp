const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const installmentSchema = new Schema({
  // Numero de cuota
  installmentNumber: {
    type: Number,
    required: true
  },
  // Vencimiento de la cuota
  dueDate: {
    type: Date,
    required: true,
  },
  // Capital
  capital: {
    type: Number,
    required: true,
  },
  // Intereses
  interest: {
    type: Number,
    required: true,
  },
  // Valor aval
  guaranteeValue: {
    type: Number,
    required: true,
  },
  // Interes causado
  accruedInterest: {
    type: Number,
    required: true,
  },
  // Devolucion
  refund: {
    type: Number,
    required: true,
  },
  // Valor cuota
  installmentValue: {
    type: Number,
    required: true,
  },
  // Valor debe
  outstandingValue: {
    type: Number,
    required: true,
  },
  // Dias vencidos
  overdueDays: {
    type: Number,
    required: true,
  },
  // Total de intereses
  totalInterest: {
    type: Number,
    required: true,
  },
  // Total de la cuota
  totalInstallment: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Installment", installmentSchema);
