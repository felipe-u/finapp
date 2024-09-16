const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema({
  brand: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  licensePlate: {
    type: String,
  },
});

module.exports = mongoose.model("Product", productSchema);
