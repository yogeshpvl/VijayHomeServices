const express = require("express");
const {
  register,
  login,
  getAllUsers,
  getUserById,
  deleteUser,
  changePassword,
  filterUsers,
} = require("../../controllers/user/user");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.delete("/users/:id", deleteUser);
router.post("/change-password", changePassword);
router.get("/users/filter", filterUsers);

module.exports = router;
