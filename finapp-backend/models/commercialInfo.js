const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const commercialInfoSchema = new Schema({
  occupation: {
    type: String,
    required: true,
  },
  salary: {
    type: String,
    required: true,
  },
  co_signerName: {
    type: String,
    required: true,
  },
  co_signerPhone: {
    type: String,
    required: true,
  },
  fundingStatus: {
    type: Schema.Types.ObjectId,
    ref: "FundingStatus",
  },
});

module.exports = mongoose.model("CommercialInfo", commercialInfoSchema);
