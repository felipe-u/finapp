const { Client } = require("../models/client");
const { User, Admin, Manager, Assistant } = require("../models/user");

const mongoDB = require("mongodb");

exports.getAllUsers = async (req, res, next) => {
  try {
    const managers = await Manager.find();
    const assistants = await Assistant.find();
    res.status(200).json({ managers, assistants });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getUser = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.createUser = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const newUser = new User({ name: name, email: email });
  newUser
    .save()
    .then(() => {
      console.log("user created");
      return res.status(201).json({ message: "User created successfully!" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ messag: "Server error" });
    });
};
