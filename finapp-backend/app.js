const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const usersRoutes = require("./routes/users");
const clientsRoutes = require("./routes/clients");
const User = require("./models/main/user");

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

// TEST
app.use((req, res, next) => {
  User.findById("66ea38cff2459af7c523f493")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use(usersRoutes);
app.use(clientsRoutes);

mongoose
  .connect(
    "mongodb+srv://felipeuv:js2NUZuqo7uTON9J@cluster0.zcixe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "Test",
          email: "test@mail.com",
          password: "test",
          role: "gestor",
          clients: [],
        });
        user.save();
      }
    });
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.log("Connection error with the database.");
    console.log(err);
  });
