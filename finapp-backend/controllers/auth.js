const { User, Admin, Manager, Assistant } = require("../models/user");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "secretkey123";

exports.register = (req, res, next) => {
  const name = req.body.name;
  const role = req.body.role;
  const email = req.body.email;
  const password = bcrypt.hashSync(req.body.password);
  const phone = req.body.phone;

  let newUser;
  switch (role) {
    case "admin":
      newUser = new Admin({ name, role, email, password, phone });
      break;
    case "manager":
      newUser = new Manager({ name, role, email, password, phone });
      break;
    case "assistant":
      newUser = new Assistant({ name, role, email, password, phone });
      break;
    default:
      return res.status(400).json({ error: "Invalid role" });
  }

  newUser
    .save()
    .then(() => {
      const userData = {
        name: newUser.name,
        role: newUser.role,
        email: newUser.email,
        phone: newUser.phone,
      };
      const expiresIn = 24 * 60 * 60;
      const accessToken = jwt.sign({ id: newUser._id }, SECRET_KEY, {
        expiresIn: expiresIn,
      });
      res.status(201).json({
        success: true,
        message: "User registered successfully",
        user: userData,
        token: accessToken,
        expiresIn: expiresIn,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        res.status(409).json({
          success: false,
          message: "User already registered",
          error: err.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Error registering user",
          error: err.message,
        });
      }
    });
};

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  
  User.findOne({ email: email }).then((user) => {
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ error: "Error comparing passwords" });
      }
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid password" });
      }
      const userData = {
        _id: user._id,
        name: user.name,
        role: user.role,
        photo: user.photo,
        email: user.email,
        phone: user.phone,
      };
      const expiresIn = 24 * 60 * 60;
      const accessToken = jwt.sign({ id: user._id }, SECRET_KEY, {
        expiresIn: expiresIn,
      });
      res.status(200).json({
        success: true,
        message: "User logged in successfully",
        user: userData,
        token: accessToken,
        expiresIn: expiresIn,
      });
    });
  });
};
