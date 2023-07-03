const express = require("express");
const {
  userRegisterCtrl,
  loginUserCtrl,
} = require("../../controllers/users/userCtrl");
const userRoutes = express.Router();

userRoutes.post("/api/users/register", userRegisterCtrl);
userRoutes.post("/api/users/login", loginUserCtrl);
module.exports = userRoutes;
