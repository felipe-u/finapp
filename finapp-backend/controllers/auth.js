const { User, Admin, Manager, Assistant } = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;

exports.register = async (req, res, next) => {
  const { name, role, email, password: rawPassword, phone } = req.body;
  try {
    const password = await bcrypt.hash(rawPassword, 10);

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
    await newUser.save();

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
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "User already registered",
        error: err.message,
      });
    }
    res.status(500).json({
      success: false,
      message: "Error registering user",
      error: err.message,
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
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
      lang: user.language,
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
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error logging in",
      error: err.message,
    });
  }
};
