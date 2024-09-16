const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const commercialInfoSchema = new Schema({
  clientType: {
    type: String,
    enum: ["debtor", "co-debtor"],
    required: true,
  },
  coDebtor: {
    type: Schema.Types.ObjectId,
    ref: "Client",
  },
  jobOccupation: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  laborSenority: {
    type: String,
    required: true,
  },
  income: {
    type: Number,
    required: true,
  },
  additionalIncome: {
    type: Number,
    required: true,
  },
  expenses: {
    type: Number,
    required: true,
  },
  financingStatus: {
    type: Schema.Types.ObjectId,
    ref: "FinancingStatus",
  },
  references: [
    {
      type: Schema.Types.ObjectId,
      ref: "Reference",
    },
  ],
});

module.exports = mongoose.model("CommercialInfo", commercialInfoSchema);
