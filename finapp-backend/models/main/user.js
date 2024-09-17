const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "gestor", "auxiliar"],
    required: true,
  },
  clients: [
    {
      type: Schema.Types.ObjectId,
      ref: "Client",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
