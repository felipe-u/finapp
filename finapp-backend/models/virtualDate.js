const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const virtualDateSchema = new Schema({
  currentDate: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("VirtualDate", virtualDateSchema);
