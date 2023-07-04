const express = require("express");
const {
  userRegisterCtrl,
  loginUserCtrl,
  fetchUsersCtrl,
  deleteUsersCtrl,
  fetchUserCtrl,
  userProfile,
  updateProfile,
} = require("../../controllers/users/userCtrl");
const authMiddleware = require("../../middleware/auth/authMiddleware");
const userRoutes = express.Router();

userRoutes.post("/register", userRegisterCtrl);
userRoutes.post("/login", loginUserCtrl);
userRoutes.get("/", authMiddleware, fetchUsersCtrl);
userRoutes.delete("/:id", deleteUsersCtrl);
userRoutes.get("/:id", fetchUserCtrl);
userRoutes.get("/profile/:id", authMiddleware, userProfile);
userRoutes.put("/:id", authMiddleware, updateProfile);
userRoutes.get("/:id", fetchUserCtrl);

module.exports = userRoutes;
