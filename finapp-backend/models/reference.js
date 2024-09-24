const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const referenceSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: Schema.Types.ObjectId,
    ref: "Address",
  },
  relationship: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Reference", referenceSchema);
