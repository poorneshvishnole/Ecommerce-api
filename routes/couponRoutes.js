import express from "express";
import {
  createCoupon,
  deleteCoupon,
  getAllCoupons,
  getCoupon,
  updateCoupon,
} from "../controllers/CouponControllers.js";
const router = express.Router();
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import isAdmin from "../middlewares/isAdmin.js";

router.post("/", isLoggedIn, isAdmin, createCoupon);
router.get("/", isLoggedIn, getAllCoupons);
router.get("/:id", isLoggedIn, getCoupon);
router.put("/:id", isLoggedIn, isAdmin, updateCoupon);
router.delete("/:id", isLoggedIn, isAdmin, deleteCoupon);

export default router;
