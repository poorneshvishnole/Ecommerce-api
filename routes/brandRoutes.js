import express from "express";
import {
  createBrand,
  deleteBrand,
  getBrand,
  getBrands,
  updateBrand,
} from "../controllers/BrandController.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import isAdmin from "../middlewares/isAdmin.js";
const router = express.Router();

router.post("/", isLoggedIn, isAdmin, createBrand);
router.get("/", getBrands);
router.get("/:id", getBrand);
router.put("/:id", updateBrand, isLoggedIn, isAdmin);
router.delete("/:id", isLoggedIn, isAdmin, deleteBrand);

export default router;
