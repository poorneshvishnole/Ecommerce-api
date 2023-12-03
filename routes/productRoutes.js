import express from "express";
const router = express.Router();
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "../controllers/ProductControllers.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import upload from "../config/fileUpload.js";
import isAdmin from "../middlewares/isAdmin.js";

router.post("/", isLoggedIn, isAdmin, upload.array("files"), createProduct);
router.get("/", getProducts);
router.get("/:id", getProduct);
router.put("/:id", isLoggedIn, isAdmin, updateProduct);
router.delete("/:id", isLoggedIn, isAdmin, deleteProduct);

export default router;
