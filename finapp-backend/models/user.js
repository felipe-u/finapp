const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "manager", "assistant"],
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
  phone: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", userSchema);

const adminSchema = new Schema({});
const Admin = User.discriminator("Admin", adminSchema);

const managerSchema = new Schema({
  clients: [
    {
      type: Schema.Types.ObjectId,
      ref: "Client",
    },
  ],
});
const Manager = User.discriminator("Manager", managerSchema);

const assistantSchema = new Schema({});
const Assistant = User.discriminator("Assistant", assistantSchema);

module.exports = {
  User,
  Admin,
  Manager,
  Assistant,
};