import { Product } from "../models/productModel.js";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js";
import asyncHandler from "../middleware/asyncHandler.js";
import CustomError from "../utils/CustomError.js";
import {
  addProductService,
  deleteProductService,
  getAllProductsService,
  updateProductService,
} from "../services/product.service.js";

export const addProduct = asyncHandler(async (req, res) => {
  const { productName, productDesc, productPrice, category, brand } = req.body;

  //check if something important is missing
  if (!productName || !productDesc || !productPrice || !category || !brand) {
    throw new CustomError("All fields are required!", 400);
  }
  
  //Middleware authentication will pass the userId
  const userId = req.id;
  const files = req.files;

  const newProduct = await addProductService({
    userId,
    productData: { productName, productDesc, productPrice, category, brand },
    files,
  });

  return res.status(200).json({
    success: true,
    message: "Product added successfully!",
    product: newProduct,
  });
});

export const getAllProducts = asyncHandler(async (req, res) => {
  const products = await getAllProductsService();

  return res.status(200).json({
    success: true,
    message: "All Products fetched successfully!",
    products,
  });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const status = await deleteProductService({ productId });

  return res.status(200).json({
    success: true,
    message: "Product deleted successfully!",
    data: status,
  });
});

export const updateProduct = asyncHandler(async (req, res) => {
  //get productID
  const { productId } = req.params;

  //get all fields
  const {
    productName,
    productDesc,
    productPrice,
    category,
    brand,
    existingImages,
  } = req.body;

  const files = req.files;

  const product = await updateProductService({
    productId,
    productData: {
      productName,
      productDesc,
      productPrice,
      category,
      brand,
      existingImages,
    },
    files,
  });

  return res.status(200).json({
    success: true,
    message: "Product Updated Successfully!",
    product,
  });
});
