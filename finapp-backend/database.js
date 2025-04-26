const mongoose = require("mongoose");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected successfully.");
  } catch (err) {
    console.error("Connection error with the database: ", err);
    process.exit(1);
  }
};

module.exports = connectDB;
