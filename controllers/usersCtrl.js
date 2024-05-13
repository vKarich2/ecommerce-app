import User from "../model/User.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";
import { getTokenFromHeader } from "../utils/getTokenFromHeader.js";
import { verifyToken } from "../utils/verifyToken.js";

// @desc		Register user
// @route		POST /api/v1/users/register
// @access	Private/Admin
export const registerUserCtrl = asyncHandler(async (req, res) => {
  const { fullname, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Error("User already exists");
  }

  // hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // create the user
  const user = await User.create({
    fullname,
    email,
    password: hashedPassword,
  });
  res.status(201).json({
    status: "success",
    message: "User created successfully",
    data: user,
  });
});

// @desc		Login user
// @route		POST /api/v1/users/login
// @access	Public
export const loginUserCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const userFound = await User.findOne({
    email,
  });
  if (userFound && (await bcrypt.compare(password, userFound?.password))) {
    res.json({
      status: "success",
      message: "User logged in successfully",
      userFound,
      token: generateToken(userFound.id),
    });
  } else {
    throw new Error("Invalid login credentials");
  }
});

// @desc		Get user profile
// @route		POST /api/v1/users/profile
// @access	Private
export const getUserProfileCtrl = asyncHandler(async (req, res) => {
  // find the user
  const user = await User.findById(req.userAuthId).populate("orders");
  res.json({
    status: "success",
    message: "User profile fetched successfully",
    user,
  });
});

// @desc		Update user shipping address
// @route		POST /api/v1/users/update/shipping
// @access	Private
export const updateShippingAddressCtrl = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    address,
    city,
    postalCode,
    province,
    country,
    phone,
  } = req.body;
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
        country,
        phone,
      },
      hasShippingAddress: true,
    },
    {
      new: true,
    },
  );

  res.json({
    status: "success",
    message: "User shipping address updated successfully",
    user,
  });
});

// @desc		Delete user
// @route		POST /api/v1/users/delete/:id
// @access	Private/Admin
export const deleteUserCtrl = asyncHandler(async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.status(200).json({
    status: "success",
    message: "User deleted successfully",
  });
});
