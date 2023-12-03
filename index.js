import express from "express";
const app = express();

import dbConnect from "./config/dbConnect.js";

import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import brandRoutes from "./routes/brandRoutes.js";
import colorRoutes from "./routes/colorRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_KEY);

import {
  globalErrorHandler,
  notFound,
} from "./middlewares/globalErrorHandler.js";

import dotenv from "dotenv";
import Order from "./models/Order.js";
dotenv.config();
dbConnect();

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (request, response) => {
    const sig = request.headers["stripe-signature"];
    console.log("helllllll");

    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
      console.log("event", event);
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const { orderId } = session.metadata;
      const paymentStatus = session.payment_status;
      const paymentMethod = session.payment_method_types[0];
      const totalAmount = session.amount_total;
      const currency = session.currency;

      const updateOrder = await Order.findByIdAndUpdate(
        JSON.parse(orderId),
        {
          totalPrice: totalAmount / 100,
          currency,
          paymentMethod,
          paymentStatus,
        },
        { new: true }
      );
    } else {
      return;
    }
    // Return a 200 response to acknowledge receipt of the event
    response.send();
  }
);

const endpointSecret =
  "whsec_d0e1f7b9d7f83363a8fde65b63a500ae4c83942017cb9fbd58500be70fbdb08d";

app.use(express.json());
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/brands", brandRoutes);
app.use("/api/v1/colors", colorRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/coupons", couponRoutes);

app.use(notFound);
app.use(globalErrorHandler);
const PORT = process.env.PORT || 4000;

app.listen(PORT, (req, res) => {
  console.log("server is running on Port " + PORT);
});
