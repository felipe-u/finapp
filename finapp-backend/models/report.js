const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const reportSchema = new Schema({
  reportType: {
    type: String,
    enum: ["debtor", "latePayment", "general"],
    required: true,
  },
  assistant: {
    type: Schema.Types.ObjectId,
    ref: "Assistant",
    required: true,
  },
});
const Report = mongoose.model("Report", reportSchema);

const debtorReportSchema = new Schema({
  debtor: {
    type: Schema.Types.ObjectId,
    ref: "Debtor",
    required: true,
  },
});
const DebtorReport = Report.discriminator("DebtorReport", debtorReportSchema);

const latePaymentReportSchema = new Schema({
  overdueDays: {
    type: Number,
    required: true,
  },
});
const LatePaymentReport = Report.discriminator(
  "LatePaymentReport",
  latePaymentReportSchema
);

const generalReportSchema = new Schema({});
const GeneralReport = Report.discriminator(
  "GeneralReport",
  generalReportSchema
);

module.exports = {
  Report,
  DebtorReport,
  LatePaymentReport,
  GeneralReport,
};
