import { Product } from "../models/productModel.js";
import { Cart } from "../models/cartModel.js";
import asyncHandler from "../middleware/asyncHandler.js";
import CustomError from "../utils/CustomError.js";
import {
  addToCartService,
  getCartService,
  removeFromCartService,
  updateQuantityService,
} from "../services/cart.service.js";

//GET CART
export const getCart = asyncHandler(async (req, res) => {
  //would get from the middleware
  const userId = req.id;

  const cart = await getCartService({ userId });

  res.status(200).json({
    success: true,
    message: "Cart fetched successfully!",
    cart,
  });
});

//ADD TO CART
export const addToCart = asyncHandler(async (req, res) => {
  const userId = req.id;
  const { productId } = req.body;

  const populatedCart = await addToCartService({ userId, productId });

  res.status(200).json({
    success: true,
    message: "Product added to cart successfully!",
    cart: populatedCart,
  });
});

//UPDATE THE QTY IN CART
export const updateQuantity = asyncHandler(async (req, res) => {
  const userId = req.id;
  const { productId, type } = req.body;

  const cart = await updateQuantityService({ userId, productId, type });

  res.status(200).json({
    success: true,
    message: "Cart updated successfully",
    cart,
  });
});

//REMOVE FROM CART
export const removeFromCart = asyncHandler(async (req, res) => {
  const userId = req.id;
  const { productId } = req.body;

  const cart = await removeFromCartService({ userId, productId });

  res.status(200).json({
    success: true,
    message: "Product removed successfully!",
    cart,
  });
});
