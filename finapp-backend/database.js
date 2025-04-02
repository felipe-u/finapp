const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://felipeuv:js2NUZuqo7uTON9J@cluster0.zcixe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("MongoDB connected successfully.");
  } catch (err) {
    console.error("Connection error with the database: ", err);
    process.exit(1);
  }
};

module.exports = connectDB;
