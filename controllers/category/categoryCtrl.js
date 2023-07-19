const expressAsyncHandler = require("express-async-handler");
const Category = require("../../model/Category/Category");
const validateMongoId = require("../../utils/validateMongodbID");

//create category
const CreateCategoryCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const category = await Category.create({
      user: req.user._id,
      title: req.body.title,
    });
    res.json(category);
  } catch (error) {
    res.json(error);
  }
});

// fetch all categories
const fetchCategoriesCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const categories = await Category.find({})
      .populate("user")
      .sort("-createdAt");
    res.json(categories);
  } catch (error) {
    res.json(error);
  }
});

// fetch a single category
const fetchCategoryCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  try {
    const categoriey = await Category.findById(id);
    res.json(categoriey);
  } catch (error) {
    res.json(error);
  }
});

//update category
const updateCategoryCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  try {
    const category = await Category.findByIdAndUpdate(
      id,
      {
        title: req?.body?.title,
      },
      {
        new: true,
      }
    );
    res.json(category);
  } catch (error) {
    res.json(error);
  }
});

// delete  a category
const deleteCategoryCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  try {
    const category = await Category.findByIdAndDelete(id);
    res.json(category);
  } catch (error) {
    res.json(error);
  }
});

module.exports = {
  CreateCategoryCtrl,
  fetchCategoriesCtrl,
  fetchCategoryCtrl,
  updateCategoryCtrl,
  deleteCategoryCtrl,
};
