import asyncHandler from "express-async-handler";
import dotenv from "dotenv";
dotenv.config();
import Stripe from "stripe";
import Order from "../model/Order.js";
import User from "../model/User.js";
import Product from "../model/Product.js";
import Coupon from "../model/Coupon.js";

// @desc		Create orders
// @route		POST /api/v1/orders
// @access	Private

// stripe instance
const stripe = new Stripe(process.env.STRIPE_KEY);

export const createOrderCtrl = asyncHandler(async (req, res) => {
  // get the coupon
  const { coupon } = req.query;

  const couponFound = await Coupon.findOne({
    code: coupon?.toUpperCase(),
  });

  // check if coupon is expired
  if (couponFound?.isExpired) {
    throw new Error("Coupon is expired");
  }

  // check if coupon does not exist
  if (!couponFound) {
    throw new Error("Coupon does not exist");
  }

  // get discount
  const discount = couponFound?.discount / 100;

  // get the payload(customer, orderItems, shippingAddress, totalPrice);
  const { orderItems, shippingAddress, totalPrice } = req.body;

  // find the user
  const user = await User.findById(req.userAuthId);

  // check if user has shipping address
  if (!user?.hasShippingAddress) {
    throw new Error("Please provide shipping address");
  }

  // check if order is not empty
  if (orderItems?.length <= 0) {
    throw new Error("No order items");
  }
  // place/create order - save into DB
  const order = await Order.create({
    user: user?._id,
    orderItems,
    shippingAddress,
    totalPrice: couponFound ? totalPrice - totalPrice * discount : totalPrice,
  });

  console.log(order);

  // update the product qty
  const products = await Product.find({ _id: { $in: orderItems } });
  orderItems?.map(async (order) => {
    const product = products?.find((product) => {
      return product?._id?.toString() === order?._id?.toString();
    });
    if (product) {
      product.totalSold += order.qty;
    }
    await product.save();
  });

  // push order into user
  user.orders.push(order?._id);

  // resave
  await user.save();

  // make payment (stripe)
  // convert order items to have same structure that stripe need
  const convertedOrders = orderItems.map((item) => {
    return {
      price_data: {
        currency: "eur",
        product_data: {
          name: item?.name,
          description: item?.description,
        },
        unit_amount: item?.price * 100,
      },
      quantity: item?.qty,
    };
  });

  const session = await stripe.checkout.sessions.create({
    line_items: convertedOrders,
    metadata: {
      orderId: JSON.stringify(order?._id),
    },
    mode: "payment",
    success_url: "http://localhost:3000/success",
    cancel_url: "http://localhost:3000/cancel",
  });

  res.send({ url: session.url });
});

// @desc		Get all orders
// @route		GET /api/v1/orders
// @access	Private

export const getOrdersCtrl = asyncHandler(async (req, res) => {
  // find all orders
  const orders = await Order.find();
  res.json({
    success: true,
    message: "All orders",
    orders,
  });
});

// @desc		Get single order
// @route		GET /api/v1/orders/:id
// @access	Private/Admin

export const getOrderCtrl = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const order = await Order.findById(id);
  res.json({
    success: true,
    message: "Single order",
    order,
  });
});

// @desc		Update order to delivered
// @route		PUT /api/v1/orders/update/:id/
// @access	Private/Admin

export const updateOrderCtrl = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const updatedOrder = await Order.findByIdAndUpdate(
    id,
    {
      status: req.body.status,
    },
    {
      new: true,
    },
  );
  res.status(200).json({
    success: true,
    message: "Order updated",
    updatedOrder,
  });
});

// @desc		Delete order
// @route		DELETE /api/v1/orders/:id/delete
// @access	Private/Admin

export const deleteOrderCtrl = asyncHandler(async (req, res) => {
  await Order.findByIdAndDelete(req.params.id);
  res.status(200).json({
    status: "success",
    message: "Order deleted successfully",
  });
});

// @desc		Get sales sum of orders
// @route		GET /api/v1/orders/sales/sum
// @access	Private/Admin
export const getOrderStatsCtrl = asyncHandler(async (req, res) => {
  // get order stats
  const orders = await Order.aggregate([
    {
      $group: {
        _id: null,
        minimumSale: {
          $min: "$totalPrice",
        },
        maximumSale: {
          $max: "$totalPrice",
        },
        totalSales: {
          $sum: "$totalPrice",
        },
        avgSale: {
          $avg: "$totalPrice",
        },
      },
    },
  ]);

  // get the date
  const date = new Date();
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const saleToday = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: today,
        },
      },
    },
    {
      $group: {
        _id: null,
        totalSales: {
          $sum: "$totalPrice",
        },
      },
    },
  ]);

  // send response
  res.json({
    success: true,
    message: "Total sales",
    orders,
    saleToday,
  });
});
