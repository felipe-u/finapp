const express = require("express");
const connectDB = require("./database");
const bodyParser = require("body-parser");

const usersRoutes = require("./routes/users");
const clientsRoutes = require("./routes/clients");
const authRoutes = require("./routes/auth");
const emailRoutes = require("./routes/email");
const imagesRoutes = require("./routes/images");
const virtualDateRoutes = require("./routes/virtualDate");
require("dotenv").config();
require("./models");

const PORT = process.env.PORT;

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
app.use(virtualDateRoutes);

app.use((err, req, res, next) => {
  console.error("captured error: ", err);
  res.status(500).json({ sucess: false, message: "Internal Server Error" });
});

module.exports = app;

if (require.main === module) {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  });
}
