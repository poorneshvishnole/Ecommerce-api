import Order from "../models/Order.js";
import Product from "../models/Product.js";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import Stripe from "stripe";
import dotenv from "dotenv";
import Coupon from "../models/Coupon.js";
dotenv.config();

//@desc create order
//@route POST/api/v1/orders
//@access private

const stripe = new Stripe(process.env.STRIPE_KEY);

export const createOrder = asyncHandler(async (req, res) => {
  const { coupon } = req.query;

  const couponFound = await Coupon.findOne({
    code: coupon?.toUpperCase(),
  });

  if (couponFound?.isExpired) {
    throw new Error("Coupon has expired");
  }

  if (!couponFound) {
    throw new Error("Coupon does not exists");
  }

  const discount = couponFound?.discount / 100;

  const { orderItems, shippingAddress, totalPrice } = req.body;

  const user = await User.findById(req.userAuthId);

  if (!user?.hasShippingAddress) {
    throw new Error("Please provide shipping address");
  }

  if (orderItems?.length <= 0) {
    throw new Error("No Order Items");
  }

  const order = await Order.create({
    user: user?._id,
    orderItems,
    shippingAddress,
    totalPrice: couponFound ? totalPrice - totalPrice * discount : totalPrice,
  });

  user.orders.push(order?._id);
  await user.save();

  const products = await Product.find({ _id: { $in: orderItems } });

  orderItems?.map(async (order) => {
    const product = products.find((product) => {
      return product?._id?.toString() === order?._id?.toString();
    });
    if (product) {
      product.totalSold += order.qty;
      await product.save();
    }
  });

  user.orders.push(order?._id);
  await user.save();

  const convertedOrders = orderItems.map((item) => {
    return {
      price_data: {
        currency: "usd",
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

//@desc get all orders
//@route GET/api/v1/orders
//@access private

export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find();
  res.json({
    success: true,
    data: orders,
    message: "Orders fetched successfully",
  });
});

//@desc get single order
//@route GET/api/v1/orders/:id
//@access private/admin

export const getOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const order = await Order.findById(id);

  res.status(200).json({
    success: true,
    message: " Order fetched successfully",
    order,
  });
});

//@desc update order
//@route GET/api/v1/orders/:id/
//@access private/admin

export const updateOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateOrder = await Order.findByIdAndUpdate(
    id,
    {
      status: req.body.status,
    },
    {
      new: true,
    }
  );

  res.status(200).json({
    success: true,
    message: "Order updated",
    updateOrder,
  });
});

//@desc get sales sum of orders
//@route GET/api/v1/orders/sales/sum
//@access private/admin

export const getSalesStats = asyncHandler(async (req, res) => {
  const orderStats = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalSales: {
          $sum: "$totalPrice",
        },
        maxSale: {
          $max: "$totalPrice",
        },
        minSale: {
          $min: "$totalPrice",
        },
        avgSale: {
          $avg: "$totalPrice",
        },
      },
    },
  ]);

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
          $sum: "$totalprice",
        },
      },
    },
  ]);

  res.status(200).json({
    success: false,
    message: "orders stats fetched succesfully",
    orderStats,
    saleToday,
  });
});
