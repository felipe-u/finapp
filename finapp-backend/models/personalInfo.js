const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const personalInfoSchema = new Schema({
  photo: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  birthDate: {
    type: Date,
    required: true,
  },
  isSimulated: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model("PersonalInfo", personalInfoSchema);
