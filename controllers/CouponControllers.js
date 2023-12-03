import Coupon from "../models/Coupon.js";
import asyncHandler from "express-async-handler";
//@desc Create new coupon
//@route POST/api/coupons
//@access Private/Admin
export const createCoupon = asyncHandler(async (req, res) => {
  const { code, startDate, endDate, discount } = req.body;

  const couponExists = await Coupon.findOne({
    code,
  });

  if (couponExists) {
    throw new Error("Coupon already exists");
  }

  if (isNaN(discount)) {
    throw new Error("Discount value must be number");
  }

  const coupon = await Coupon.create({
    code: code?.toUpperCase(),
    startDate,
    endDate,
    discount,
    user: req.userAuthId,
  });

  res.status(201).json({
    success: true,
    message: "Coupon created successfully",
    coupon,
  });
});

//@desc get all coupon
//@route get/api/coupons
//@access Private/Admin

export const getAllCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find();
  res.status(200).json({
    success: true,
    message: "All coupons",
    coupons,
  });
});

//@desc get  coupon
//@route get/api/coupons/:id
//@access Private/Admin

export const getCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  res.status(200).json({
    success: true,
    message: "Coupon Fetched",
    coupon,
  });
});

//@desc update coupon
//@route post/api/coupons/:id
//@access Private/Admin

export const updateCoupon = asyncHandler(async (req, res) => {
  const { code, startDate, endDate, discount } = req.body;

  const updateCoupon = await Coupon.findByIdAndUpdate(
    req.params.id,
    {
      code: code?.toUpperCase(),
      discount,
      startDate,
      endDate,
    },
    {
      new: true,
    }
  );

  res.json({
    success: true,
    message: "Coupon fetched",
    updateCoupon,
  });
});

//@desc delete coupon
//@route delete/api/coupons
//@access Private/Admin

export const deleteCoupon = asyncHandler(async (req, res) => {
  await Coupon.findByIdAndDelete(req.params.id);
  res.json({
    status: "success",
    message: " Coupon deleted successfully",
  });
});
