const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const motorcycleSchema = new Schema({
  licensePlate: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Motorcycle", motorcycleSchema);
