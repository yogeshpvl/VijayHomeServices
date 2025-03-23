const express = require("express");
const {
  register,
  login,
  getAllUsers,
  getUserById,
  deleteUser,
  changePassword,
  filterUsers,
  updateUser,
  updateUserRights,
} = require("../../controllers/user/user");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/users", getAllUsers);
router.put("/users/:id", updateUser);
router.get("/users/:id", getUserById);
router.delete("/users/:id", deleteUser);
router.post("/change-password", changePassword);
router.get("/users/filter", filterUsers);
router.put("/users/userRights/:id", updateUserRights);

module.exports = router;
