import asyncHandler from "express-async-handler";
import Coupon from "../model/Coupon.js";

// @desc		Create new coupon
// @route		POST /api/v1/coupons
// @access	Private/Admin
export const createCoupon = asyncHandler(async (req, res) => {
  const { code, startDate, endDate, discount } = req.body;
  // check if admin
  // check if coupon already exists
  const couponExists = await Coupon.findOne({
    code,
  });
  if (couponExists) {
    throw new Error("Coupon already exists");
  }
  if (isNaN(discount)) {
    throw new Error("Discount is not a number");
  }

  // create coupon
  const coupon = await Coupon.create({
    code: code?.toUpperCase(),
    startDate,
    endDate,
    discount,
    user: req.userAuthId,
  });
  res.status(201).json({
    status: "success",
    message: "Coupon created",
    coupon,
  });
});

// @desc		Get coupons
// @route		GET /api/v1/coupons
// @access	Private/Admin

export const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find();
  res.status(200).json({
    status: "success",
    message: "Coupons fetched successfully",
    coupons,
  });
});

// @desc		Get single coupon
// @route		GET /api/v1/coupons/:id
// @access	Private/Admin

export const getCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) {
    throw new Error("Coupon not found");
  }
  res.json({
    status: "success",
    message: "Coupon fetched successfully",
    coupon,
  });
});

// @desc		Update coupon
// @route		PUT /api/v1/coupons/:id
// @access	Private/Admin
export const updateCoupon = asyncHandler(async (req, res) => {
  const { code, startDate, endDate, discount } = req.body;
  await Coupon.findByIdAndUpdate(
    req.params.id,
    {
      code: code?.toUpperCase(),
      startDate,
      endDate,
      discount,
    },
    {
      new: true,
    },
  );
  res.status(200).json({
    status: "success",
    message: "Coupon updated successfully",
  });
});

// @desc		Delete coupon
// @route		DELETE /api/v1/coupons/:id/delete
// @access	Private/Admin
export const deleteCoupon = asyncHandler(async (req, res) => {
  await Coupon.findByIdAndDelete(req.params.id);
  res.status(200).json({
    status: "success",
    message: "Coupon deleted successfully",
  });
});
