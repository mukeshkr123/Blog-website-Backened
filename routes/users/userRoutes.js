const express = require("express");
const {
  userRegisterCtrl,
  loginUserCtrl,
  fetchUsersCtrl,
  deleteUsersCtrl,
  fetchUserCtrl,
  userProfile,
} = require("../../controllers/users/userCtrl");
const authMiddleware = require("../../middleware/auth/authMiddleware");
const userRoutes = express.Router();

userRoutes.post("/register", userRegisterCtrl);
userRoutes.post("/login", loginUserCtrl);
userRoutes.get("/", authMiddleware, fetchUsersCtrl);
userRoutes.delete("/:id", deleteUsersCtrl);
userRoutes.get("/:id", fetchUserCtrl);
userRoutes.get("/profile/:id", userProfile);
userRoutes.get("/:id", fetchUserCtrl);

module.exports = userRoutes;
