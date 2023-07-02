const express = require("express");
const { userRegisterCtrl } = require("../../controllers/users/userCtrl");
const userRoutes = express.Router();

userRoutes.post("/api/users/register", userRegisterCtrl);

module.exports = userRoutes;
