const express = require("express");
const connectDB = require("./database");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const usersRoutes = require("./routes/users");
const clientsRoutes = require("./routes/clients");
const authRoutes = require("./routes/auth");
const emailRoutes = require("./routes/email");
const imagesRoutes = require("./routes/images");

require("./models");

const { User, Admin, Manager, Assistant } = require("./models/user");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  next();
});

app.use("/uploads", express.static("uploads"));

app.use(usersRoutes);
app.use(clientsRoutes);
app.use(authRoutes);
app.use(emailRoutes);
app.use(imagesRoutes);

module.exports = app;

if (require.main === module) {
  connectDB().then(() => {
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  });
}