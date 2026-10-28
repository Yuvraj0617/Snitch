import { Router } from "express";
import { createProduct,getAllProducts,getProductDetail,updateProduct,deleteProduct} from "../controllers/product.controller.js";
import { authenticate,authorizeseller} from "../middlewares/auth.middleware.js";
import { upload } from "../Services/fileUpload.services.js";
import { createProductValidator } from "../validator/product.validator.js";

const router = Router();
// Protected routes 
router.post("/products", authenticate, authorizeseller, upload.array("images", 5), createProductValidator, createProduct);
router.put("/products/:id",authenticate,authorizeseller,updateProduct);
router.delete("/products/:id",authenticate,authorizeseller,deleteProduct);

// Public routes
router.get("/products",getAllProducts)
router.get("/products/:id",getProductDetail);

export default router;
