import express from "express";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import {
  addToCart,
  getCart,
  updateQuantity,
  removeFromCart,
} from "../controllers/cartController.js";

const router = express.Router();

/********** CART ROUTES **********/

/*GET CART ITEMS */
router.get("/", isAuthenticated, getCart);

/*ADD TO CART */
router.post("/add", isAuthenticated, addToCart);

/*UPDATE QUANTITY */
router.put("/update", isAuthenticated, updateQuantity);

/*REMOVE FROM CART */
router.delete("/remove", isAuthenticated, removeFromCart);

export default router;
