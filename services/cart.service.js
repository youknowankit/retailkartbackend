import { Cart } from "../models/cartModel.js";
import { Product } from "../models/productModel.js";
import CustomError from "../utils/CustomError.js";

export const getCartService = async ({ userId }) => {
  const cart = await Cart.findOne({ userId }).populate("items.productId");
  if (!cart)
    // return {
    //   cart: {
    //     items: [],
    //     totalPrice: 0,
    //   },
    // };

    return {
      items: [],
      totalPrice: 0,
    };

  return cart;
};

export const addToCartService = async ({ userId, productId }) => {
  //check if product exists or not
  const product = await Product.findById(productId);
  if (!product) {
    throw new CustomError("Product not found", 404);
  }

  //find user's cart if it exists
  let cart = await Cart.findOne({ userId });

  //if cart doesn't exist, create a new cart
  if (!cart) {
    cart = new Cart({
      userId,
      items: [{ productId, quantity: 1, price: product.productPrice }],
      totalPrice: product.productPrice,
    });
  } else {
    //Find if the product already exists in the cart
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId.toString(),
    );
    if (itemIndex > -1) {
      //if product exists in the cart, update the quantity and price
      cart.items[itemIndex].quantity += 1;
    } else {
      //if product doesn't exist in the cart, add the product to the cart
      cart.items.push({
        productId,
        quantity: 1,
        price: product.productPrice,
      });
    }

    //Recalculate the total price of the cart
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.quantity * item.price,
      0,
    );
  }

  //Save the cart
  await cart.save();

  //populate the product details before sending the response
  const populatedCart = await Cart.findById(cart._id).populate(
    "items.productId",
  );

  return populatedCart;
};

export const updateQuantityService = async ({ userId, productId, type }) => {
  //find cart first
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    throw new CustomError("Cart not found", 404);
  }

  //check if item is in the cart
  const item = cart.items.find(
    (item) => item.productId.toString() === productId.toString(),
  );
  //if not
  if (!item) {
    throw new CustomError("Product not found in cart", 404);
  }

  //Check for type
  if (!["increase", "decrease"].includes(type)) {
    throw new CustomError("Type must be either increase or decrease", 400);
  }

  if (type === "increase") item.quantity += 1;

  /*Old Functionality */
  // if (type === "decrease" && item.quantity > 1) item.quantity -= 1;
  /*New Functionality: Decreasing less than 1 removes item */
  if (type === "decrease") {
    if (item.quantity === 1) {
      cart.items = cart.items.filter(
        (i) => i.productId.toString() !== productId,
      );
    } else {
      item.quantity -= 1;
    }
  }

  cart.totalPrice = cart.items.reduce(
    (total, item) => total + item.quantity * item.price,
    0,
  );

  await cart.save();
  cart = await cart.populate("items.productId");

  return cart;
};

export const removeFromCartService = async ({ userId, productId }) => {
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    throw new CustomError("Cart not found", 404);
  }

  //Added to check if item exists
  const existingItem = cart.items.find(
    (item) => item.productId.toString() === productId.toString(),
  );
  if (!existingItem) {
    throw new CustomError("Product not found in cart", 404);
  }

  cart.items = cart.items.filter(
    (item) => item.productId.toString() !== productId,
  );
  cart.totalPrice = cart.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  await cart.save();

  cart = await cart.populate("items.productId");

  return cart;
};
