const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const commercialInfoSchema = new Schema({
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
  isSimulated: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model("CommercialInfo", commercialInfoSchema);
