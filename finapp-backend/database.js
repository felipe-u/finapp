const mongoose = require("mongoose");
const logger = require("./utils/logger");
const logMessages = require("./utils/logMessages");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    logger.info(logMessages.MONGODB_CONNECTED);
  } catch (err) {
    logger.error(logMessages.MONGODB_CONNECTION_ERROR);
    process.exit(1);
  }
};

module.exports = connectDB;
