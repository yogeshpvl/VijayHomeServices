const User = require("../../models/user/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign({ id: user.id, roles: user.roles }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, displayname, contactno, password } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check for duplicate email if email is being changed
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ where: { email } });
      if (emailExists) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    // Update fields
    user.displayname = displayname || user.displayname;
    user.contactno = contactno || user.contactno;
    user.email = email || user.email;

    // Hash and update password if provided
    if (password && password.trim() !== "") {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    return res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
// Register User
const register = async (req, res) => {
  try {
    const { email, password, displayname, contactno, roles, category, city } =
      req.body;

    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // Create new user
    const newUser = await User.create({
      email,
      password,
      displayname,
      contactno,
      roles,
      category,
      city,
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login User
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(user);
    console.log("token", token);
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get User by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete User
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    await user.destroy();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Change Password
const changePassword = async (req, res) => {
  try {
    const { userId, oldPassword, newPassword } = req.body;
    const user = await User.findByPk(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch)
      return res.status(401).json({ message: "Old password is incorrect" });

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Filter Users by Role, Category, or City
const filterUsers = async (req, res) => {
  try {
    const { roles, category, city } = req.query;
    const whereClause = {};
    if (roles) whereClause.roles = roles;
    if (category) whereClause.category = category;
    if (city) whereClause.city = city;

    const users = await User.findAll({ where: whereClause });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUserRights = async (req, res) => {
  try {
    const { id } = req.params;
    const { roles, category, city } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.roles = roles || {};
    user.category = category || [];
    user.city = city || [];

    await user.save();

    res.status(200).json({ message: "User rights updated successfully" });
  } catch (error) {
    console.error("Error updating user rights:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  register,
  login,
  getAllUsers,
  getUserById,
  deleteUser,
  changePassword,
  filterUsers,
  updateUser,
  updateUserRights,
};
