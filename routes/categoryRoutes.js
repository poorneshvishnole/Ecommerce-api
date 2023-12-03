import express from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
} from "../controllers/CategoryControllers.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import upload from "../config/fileUpload.js";
const router = express.Router();

router.post("/", isLoggedIn, upload.single("file"), createCategory);
router.get("/", getCategories);
router.get("/:id", getCategory);
router.put("/:id", isLoggedIn, updateCategory);
router.delete("/:id", isLoggedIn, deleteCategory);
export default router;
