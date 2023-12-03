import express from "express";
const router = express.Router();
import {
  createOrder,
  getAllOrders,
  getOrder,
  getSalesStats,
  updateOrder,
} from "../controllers/OrderController.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

router.post("/", isLoggedIn, createOrder);
router.get("/", isLoggedIn, getAllOrders);
router.get("/:id", isLoggedIn, getOrder);
router.put("/:id", isLoggedIn, updateOrder);
router.get("/sales/stats", isLoggedIn, getSalesStats);

export default router;
