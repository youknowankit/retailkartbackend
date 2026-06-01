import express from "express";
import {
  addProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
} from "../controllers/productController.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { isAdmin } from "../middleware/isAdmin.js";
import { multipleUpload } from "../middleware/multer.js";

const router = express.Router();

/*ADD PRODUCT:
1. Only admins can add product: isAuthenticated and isAdmin
2. Also, uploading image while adding product so we need multiple upload
*/

router.post("/add", isAuthenticated, isAdmin, multipleUpload, addProduct);

/*GET ALL PRODUCT */
router.get("/getAllProducts", getAllProducts);

/*DELETE A PRODUCT */
router.delete("/delete/:productId", isAuthenticated, isAdmin, deleteProduct);

/*UPDATE PRODUCT */
router.put(
  "/update/:productId",
  isAuthenticated,
  isAdmin,
  multipleUpload,
  updateProduct,
);
export default router;
