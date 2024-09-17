const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const personalInfoSchema = new Schema({
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
  birthDate: {
    type: Date,
  },
  photo: {
    type: String,
  },
});

module.exports = mongoose.model("PersonalInfo", personalInfoSchema);
