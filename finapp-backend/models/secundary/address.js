const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const addressSchema = new Schema({
  country: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  neighbourhood: {
    type: String,
    required: true,
  },
  sector: {
    type: String,
    required: true,
  },
  additionalInfo: {
    type: String,
  },
});

module.exports = mongoose.model("Address", addressSchema);
