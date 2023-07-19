const express = require("express");
const {
  CreateCategoryCtrl,
  fetchCategoriesCtrl,
  fetchCategoryCtrl,
} = require("../../controllers/category/categoryCtrl");
const authMiddleware = require("../../middleware/auth/authMiddleware");
const categoryRoute = express.Router();

categoryRoute.post("/", authMiddleware, CreateCategoryCtrl);
categoryRoute.get("/", authMiddleware, fetchCategoriesCtrl);
categoryRoute.get("/:id", authMiddleware, fetchCategoryCtrl);

module.exports = categoryRoute;
