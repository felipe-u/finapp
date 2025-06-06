const express = require("express");
const connectDB = require("./database");
const bodyParser = require("body-parser");
const logger = require("./utils/logger");
const logMessages = require("./utils/logMessages");

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

module.exports = app;

if (require.main === module) {
  connectDB().then(() => {
    app.listen(PORT, () => {
      logger.info(logMessages.SERVER_STARTED(PORT));
    });
  });
}
