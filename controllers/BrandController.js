import asyncHandler from "express-async-handler";
import Brand from "../models/Brand.js";

//@desc Create new brand
//@route POST/api/v1/brand
//@access  Private/Admin

export const createBrand = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const brandExist = await Brand.findOne({ name: name.toLowerCase() });

  if (brandExist) {
    throw new Error("Brand already exists");
  }

  const brand = await Brand.create({
    name: name.toLowerCase(),
    user: req.userAuthId,
  });

  res.status(201).json({
    success: true,
    brand,
    message: "Category created successfully",
  });
});

//@desc Get all brands
//@route GET/api/v1/brands
//@route  Public

export const getBrands = asyncHandler(async (req, res) => {
  const brands = await Brand.find();

  res.status(200).json({
    success: true,
    message: "Categories Fetched successfully",
    brands,
  });
});

//@desc Get single brand
//@route GET/api/v1/brands/:id
//@route  Public

export const getBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const brand = await Brand.findById({ _id: id });

  res.status(200).json({
    success: true,
    message: "Category fetched successfully",
    brand,
  });
});

//@desc Update brand
//@route Put/api/v1/brands/:id
//@route  Private/admin

export const updateBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const updateBrand = await Brand.findByIdAndUpdate(
    { _id: id },
    { name },
    {
      new: true,
    }
  );

  res.status(200).json({
    success: true,
    message: "Brand updated successfully",
    updateBrand,
  });
});

//@desc Delete Brand
//@route Delete/api/v1/brands/:id
//@route  Private/admin

export const deleteBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await Brand.findByIdAndDelete({ _id: id });

  res.status(200).json({
    success: true,
    message: "Brand deleted successfully",
  });
});
