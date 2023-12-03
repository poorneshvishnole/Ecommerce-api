import express from "express";
import { createReview } from "../controllers/ReviewContoller.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
const router = express.Router();

router.post("/:productID", isLoggedIn, createReview);

export default router;
