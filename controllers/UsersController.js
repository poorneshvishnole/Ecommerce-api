import User from "../models/User.js";
import asyncHandler from "express-async-handler";
import { generateToken } from "../utils/genrateToken.js";
import { verifyToken } from "../utils/verifyToken.js";
import bcrypt from "bcrypt";

// @desc Register user
// @route POST /api/v1/users/register
// @access Private/Admin
export const registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, password } = req.body;
  const userExist = await User.findOne({ email });

  if (userExist) {
    throw new Error("User already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    fullname,
    email,
    password: hashedPassword,
  });

  return res.status(201).json({
    success: true,
    user: user,
  });
});

// @desc Login user
// @route POST /api/v1/users/login
// @access Private/Admin
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const userExist = await User.findOne({ email });

  if (userExist && (await bcrypt.compare(password, userExist.password))) {
    return res.status(200).json({
      success: true,
      user: userExist,
      token: generateToken(userExist._id),
      message: "Login succesfully",
    });
  } else {
    throw new Error("Invalid login credentials");
  }
});

// @desc Get user profile
// @route GET /api/v1/users/profile
// @access Private
export const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userAuthId).populate("orders");
  res.json({
    status: "success",
    msg: "welcome profile page",
    user,
  });
});

//@desc Update user shipping address
//@route PUT/api/v1/users/updates/shipping
//@acess private

export const updateShippingAddress = asyncHandler(async (req, res) => {
  const { firstName, lastName, address, city, postalCode, province, phone } =
    req.body;
  const user = await User.findByIdAndUpdate(
    req.userAuthId,
    {
      shippingAddress: {
        firstName,
        lastName,
        address,
        city,
        postalCode,
        province,
        phone,
      },
      hasShippingAddress: true,
    },
    {
      new: true,
    }
  );

  res.status(201).json({
    status: "success",
    message: "User shipping address updated successfully",
    user,
  });
});
