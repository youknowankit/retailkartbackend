import { Product } from "../models/productModel.js";
import cloudinary from "../utils/cloudinary.js";
import CustomError from "../utils/CustomError.js";
import getDataUri from "../utils/dataUri.js";

export const addProductService = async ({ userId, files, productData }) => {
  const { productName, productDesc, productPrice, category, brand } =
    productData;

  //Handle multiple image upload
  let productImg = [];
  //if files are more than one then we have to use the loop to access files
  if (files && files.length > 0) {
    for (const file of files) {
      //passing each file to URI for uploading
      const fileUri = getDataUri(file);
      const result = await cloudinary.uploader.upload(fileUri, {
        folder: "retailkart_products", //cloudinary folder name
      });

      productImg.push({
        url: result.secure_url,
        public_id: result.public_id,
      });
    }
  }

  //Create a product in DB
  const newProduct = await Product.create({
    userId,
    productName,
    productDesc,
    productPrice,
    category,
    brand,
    productImg, //array of objects [{url, public_id}]
  });

  return newProduct;
};

export const getAllProductsService = async () => {
  const products = await Product.find();
  //Instead of using !products better to use products.length
  if (products.length === 0) {
    throw new CustomError("No Products available", 404);
    // return (products = []);
  }
  return products;
};

export const deleteProductService = async ({ productId }) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new CustomError("Product not found", 404);
  }

  //Delete images from the cloudinary
  for (const img of product.productImg) {
    await cloudinary.uploader.destroy(img.public_id);
  }

  await Product.findByIdAndDelete(productId);

  return true;
};

export const updateProductService = async ({
  productId,
  productData,
  files,
}) => {
  const {
    productName,
    productDesc,
    productPrice,
    category,
    brand,
    existingImages,
  } = productData;

  const product = await Product.findById(productId);
  if (!product) {
    throw new CustomError("Product not found", 404);
  }

  let updatedImages = [];
  //keep selected old images
  if (existingImages) {
    // const keepIds = JSON.parse(existingImages); //could crash
    let keepIds = [];
    try {
      keepIds = JSON.parse(existingImages);
    } catch (error) {
      throw new CustomError("Invalid existingImages format", 400);
    }
    updatedImages = product.productImg.filter((img) =>
      keepIds.includes(img.public_id),
    );

    //delete only removed images
    const removedImages = product.productImg.filter(
      (img) => !keepIds.includes(img.public_id),
    );

    for (let img of removedImages) {
      await cloudinary.uploader.destroy(img.public_id);
    }
  } else {
    updatedImages = product.productImg; //keep all if nothing sent
  }

  //upload new images if any
  if (files && files.length > 0) {
    for (let file of files) {
      const fileUri = getDataUri(file);
      const result = await cloudinary.uploader.upload(fileUri, {
        folder: "retailkart_products",
      });
      updatedImages.push({
        url: result.secure_url,
        public_id: result.public_id,
      });
    }
  }

  //Update Product
  product.productName = productName || product.productName;
  product.productDesc = productDesc || product.productDesc;
  product.productPrice =
    productPrice !== undefined ? Number(productPrice) : product.productPrice;
  product.category = category || product.category;
  product.brand = brand || product.brand;
  product.productImg = updatedImages;

  await product.save();

  return product;
};
