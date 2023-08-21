const express = require("express");
const {
  CreateCategoryCtrl,
  fetchCategoriesCtrl,
  fetchCategoryCtrl,
  updateCategoryCtrl,
  deleteCategoryCtrl,
} = require("../../controllers/category/categoryCtrl");
const authMiddleware = require("../../middleware/auth/authMiddleware");
const categoryRoute = express.Router();

categoryRoute.post("/", authMiddleware, CreateCategoryCtrl);
categoryRoute.get("/", fetchCategoriesCtrl);
categoryRoute.get("/:id", authMiddleware, fetchCategoryCtrl);
categoryRoute.put("/:id", authMiddleware, updateCategoryCtrl);
categoryRoute.delete("/:id", authMiddleware, deleteCategoryCtrl);

module.exports = categoryRoute;
