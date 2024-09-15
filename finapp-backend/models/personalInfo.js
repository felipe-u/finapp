const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const personalInfoSchema = new Schema({
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
  },
  birthDate: {
    type: Date
  }
  
});

module.exports = mongoose.model("PersonalInfo", personalInfoSchema);
