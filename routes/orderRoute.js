import express from "express";
import {
  createOrder,
  getAllOrders,
  getMyOrders,
  getSalesData,
  getUserOrders,
  verifyPayment,
} from "../controllers/orderController.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = express.Router();

router.post("/create-order", isAuthenticated, createOrder);
router.post("/verify-payment", isAuthenticated, verifyPayment);
router.get("/myorders", isAuthenticated, getMyOrders);
router.get("/user-order/:userId", isAuthenticated, isAdmin, getUserOrders);
router.get("/all", isAuthenticated, isAdmin, getAllOrders);
router.get("/sales", isAuthenticated, isAdmin, getSalesData);

export default router;
