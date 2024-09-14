const user = require("../models/user");
const User = require("../models/user");

const mongoDB = require("mongodb");

exports.getUsers = (req, res, next) => {
  User.find().then((users) => {
    res.status(200).json({ users: users });
  });
};

exports.createUser = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const newUser = new User({ name: name, email: email });
  newUser
    .save()
    .then(() => {
      console.log('user created');
      return res.status(201).json({ message: "User created successfully!" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ messag: "Server error" });
    });
};
