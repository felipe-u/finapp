const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const usersRoutes = require("./routes/users");
const clientsRoutes = require("./routes/clients");
const authRoutes = require("./routes/auth");
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

app.use(usersRoutes);
app.use(clientsRoutes);
app.use(authRoutes);

mongoose
  .connect(
    "mongodb+srv://felipeuv:js2NUZuqo7uTON9J@cluster0.zcixe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.log("Connection error with the database.");
    console.log(err);
  });
