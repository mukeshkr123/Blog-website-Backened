const express = require("express");
const {
  CreateCategoryCtrl,
} = require("../../controllers/category/categoryCtrl");
const authMiddleware = require("../../middleware/auth/authMiddleware");
const categoryRoute = express.Router();

categoryRoute.post("/", authMiddleware, CreateCategoryCtrl);

module.exports = categoryRoute;
