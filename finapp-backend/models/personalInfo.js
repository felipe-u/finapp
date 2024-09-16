const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const personalInfoSchema = new Schema({
  photo: {
    type: String,
  },
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
});

module.exports = mongoose.model("PersonalInfo", personalInfoSchema);
