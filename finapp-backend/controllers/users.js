const { User, Manager, Assistant } = require("../models/user");
const bcrypt = require("bcryptjs");

exports.getAllUsers = async (req, res, next) => {
  if (req.query.searchTerm) {
    return await exports.getUsersBySearchTerm(req, res, next);
  } else {
    try {
      const managers = await Manager.find();
      const assistants = await Assistant.find();
      res.status(200).json({ managers, assistants });
    } catch (err) {
      res.status(500).json({
        message: "Server error",
        error: err.message,
      });
    }
  }
};

exports.getUsersBySearchTerm = async (req, res, next) => {
  const searchTerm = req.query.searchTerm;
  const query = { name: { $regex: searchTerm, $options: "i" } };
  try {
    const managers = await Manager.find(query);
    const assistants = await Assistant.find(query);
    res.status(200).json({ managers, assistants });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
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
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

exports.updateUser = async (req, res, next) => {
  const userId = req.body.userId;
  const email = req.body.email;
  const phone = req.body.phone;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.email = email;
    user.phone = phone;
    await user.save();
    console.log("user updated");
    return res.status(200).json({ message: "User updated successfully!" });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
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
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

exports.changePassword = async (req, res, next) => {
  const userId = req.body.userId;
  const newPassword = req.body.newPassword;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const hashedPassword = bcrypt.hashSync(newPassword);
    user.password = hashedPassword;
    await user.save();
    console.log("password updated");
    return res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

exports.changeLang = async (req, res, next) => {
  const userId = req.body.userId;
  const newLang = req.body.newLang;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.language = newLang;
    await user.save();
    console.log("Language updated");
    return res.status(200).json({ message: "Language changed successfully" });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

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
