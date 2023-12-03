import asyncHandler from "express-async-handler";
import Category from "../models/Category.js";

//@desc Create new category
//@route POST/api/v1/categories
//@route  Private/Admin

export const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const categoryExist = await Category.findOne({ name: name.toLowerCase() });

  if (categoryExist) {
    throw new Error("Category already exists");
  }

  const category = await Category.create({
    name: name.toLowerCase(),
    image: req.file.path,
    user: req.userAuthId,
  });

  res.status(201).json({
    success: true,
    category,
    message: "Category created successfully",
  });
});

//@desc Get all categories
//@route GET/api/v1/categories
//@route  Public

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find();

  res.status(200).json({
    success: true,
    message: "Categories Fetched successfully",
    categories,
  });
});

//@desc Get single category
//@route GET/api/v1/categories/:id
//@route  Public

export const getCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const category = await Category.findById({ _id: id });

  res.status(200).json({
    success: true,
    message: "Category fetched successfully",
    category,
  });
});

//@desc Update category
//@route Put/api/v1/categories/:id
//@route  Private/admin

export const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const updateCategory = await Category.findByIdAndUpdate(
    { _id: id },
    { name },
    {
      new: true,
    }
  );

  res.status(200).json({
    success: true,
    message: "Category updated successfully",
    updateCategory,
  });
});

//@desc Delete category
//@route Delete/api/v1/categories/:id
//@route  Private/admin

export const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await Category.findByIdAndDelete({ _id: id });

  res.status(200).json({
    success: true,
    message: "Category deleted successfully",
  });
});
