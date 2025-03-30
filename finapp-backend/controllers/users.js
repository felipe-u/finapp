const { User, Manager, Assistant } = require("../models/user");
const bcrypt = require("bcryptjs");

const mongoDB = require("mongodb");

exports.getAllUsers = async (req, res, next) => {
  if (req.query.searchTerm) {
    exports.getUsersBySearchTerm(req, res, next);
  } else {
    try {
      const managers = await Manager.find();
      const assistants = await Assistant.find();
      res.status(200).json({ managers, assistants });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  }
};

exports.getUsersBySearchTerm = async (req, res, next) => {
  const searchTerm = req.query.searchTerm;
  const query = { name: { $regex: searchTerm, $options: "i" } };
  try {
    Manager.find(query).then((managers) => {
      Assistant.find(query).then((assistants) => {
        res.status(200).json({ managers, assistants });
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getUser = async (req, res, next) => {
  const userId = req.query.userId;
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

exports.updateUser = (req, res, next) => {
  const userId = req.body.userId;
  const email = req.body.email;
  const phone = req.body.phone;
  User.findById(userId).then((user) => {
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.email = email;
    user.phone = phone;
    user
      .save()
      .then(() => {
        console.log("user updated");
        return res.status(200).json({ message: "User updated successfully!" });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ message: "Server error" });
      });
  });
};

exports.checkPassword = async (req, res, next) => {
  const userId = req.body.userId;
  const oldPassword = req.body.oldPassword;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.json(false);
    }
    return res.json(true);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.changePassword = (req, res, next) => {
  const userId = req.body.userId;
  const newPassword = req.body.newPassword;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const hashedPassword = bcrypt.hashSync(newPassword);
      user.password = hashedPassword;
      user
        .save()
        .then(() => {
          console.log("password updated");
          return res
            .status(200)
            .json({ message: "Password changed successfully" });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({ message: "Server error" });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Server error" });
    });
};

exports.changeLang = (req, res, next) => {
  const userId = req.body.userId;
  const newLang = req.body.newLang;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      user.language = newLang;
      user
        .save()
        .then(() => {
          console.log("Language updated");
          return res
            .status(200)
            .json({ message: "Language changed successfully" });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({ message: "Server error" });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Server error" });
    });
}

// exports.updateFields = async (req, res, next) => {
//   try {
//     const result = await User.updateMany(
//       { language: { $exists: false } },
//       { $set: { language: "es" } }
//     );
//     console.log("Users updated: result");
//     res.status(200).json({ message: "Users updated successfully", result });
//   } catch (error) {
//     console.error("Error updating user fields: ", error);
//     res.status(500).json({ message: "Internal Server error", error });
//   }
// };
