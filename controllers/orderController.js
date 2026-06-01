import razorpayInstance from "../config/razorpay.js";
import { Order } from "../models/orderModel.js";
import { Cart } from "../models/cartModel.js";
import { User } from "../models/userModel.js";
import { Product } from "../models/productModel.js";

import asyncHandler from "../middleware/asyncHandler.js";
import {
  createOrderService,
  getAllOrdersService,
  getMyOrdersService,
  getSalesDataService,
  getUserOrdersService,
  verifyPaymentService,
} from "../services/order.service.js";

//CREATE ORDER
export const createOrder = asyncHandler(async (req, res) => {
  const { products, amount, tax, shipping, currency } = req.body;
  const userId = req.user._id;

  const razorpayOrder = await createOrderService({
    userId,
    productData: { products, amount, tax, shipping, currency },
  });

  res.status(201).json({
    success: true,
    order: razorpayOrder,
    message: "Order created successfully",
  });
});

//VERIFY PAYMENT
export const verifyPayment = asyncHandler(async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    paymentFailed,
  } = req.body;

  const userId = req.user._id;

  const order = await verifyPaymentService({
    userId,
    razorpayData: {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      paymentFailed,
    },
  });

  return res.status(200).json({
    success: true,
    message: "Payment verified and order updated successfully",
    order,
  });
});

//GET ORDERS
export const getMyOrders = asyncHandler(async (req, res) => {
  const userId = req.id;

  const orders = await getMyOrdersService({ userId });

  res.status(200).json({
    success: true,
    count: orders.length,
    orders,
  });
});

//GET ALL USER ORDERS (ADMIN)
export const getUserOrders = asyncHandler(async (req, res) => {
  const { userId } = req.params; //From URL via frontend

  const orders = await getUserOrdersService({ userId });

  res.status(200).json({
    success: true,
    count: orders.length,
    orders,
  });
});

// GET ALL ORDERS (ADMIN)
export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await getAllOrdersService();

  console.log(orders);

  res.status(200).json({
    success: true,
    count: orders.length,
    orders,
  });
});

//Dashboard Sales Data
export const getSalesData = asyncHandler(async (req, res) => {
  const { totalUsers, totalProducts, totalOrders, totalSales, formattedSales } =
    await getSalesDataService();

  res.json({
    success: true,
    totalUsers,
    totalProducts,
    totalOrders,
    totalSales,
    sales: formattedSales,
  });
});
