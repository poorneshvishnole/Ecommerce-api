import asyncHandler from "express-async-handler";
import Color from "../models/Color.js";

//@desc Create new color
//@route POST/api/v1/color
//@access  Private/Admin

export const createColor = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const colorExist = await Color.findOne({ name: name.toLowerCase() });

  if (colorExist) {
    throw new Error("Color already exists");
  }

  const color = await Color.create({
    name: name.toLowerCase(),
    user: req.userAuthId,
  });

  res.status(201).json({
    success: true,
    color,
    message: "Color created successfully",
  });
});

//@desc Get all colors
//@route GET/api/v1/colors
//@route  Public

export const getColors = asyncHandler(async (req, res) => {
  const colors = await Color.find();

  res.status(200).json({
    success: true,
    message: "Categories Fetched successfully",
    colors,
  });
});

//@desc Get single color
//@route GET/api/v1/colors/:id
//@route  Public

export const getColor = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const color = await Color.findById({ _id: id });

  res.status(200).json({
    success: true,
    message: "Color fetched successfully",
    color,
  });
});

//@desc Update color
//@route Put/api/v1/colors/:id
//@route  Private/admin

export const updateColor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const colorBrand = await Color.findByIdAndUpdate(
    { _id: id },
    { name },
    {
      new: true,
    }
  );

  res.status(200).json({
    success: true,
    message: "Color updated successfully",
    updateColor,
  });
});

//@desc Delete Color
//@route Delete/api/v1/colors/:id
//@route  Private/admin

export const deleteColor = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await Color.findByIdAndDelete({ _id: id });

  res.status(200).json({
    success: true,
    message: "Color deleted successfully",
  });
});
