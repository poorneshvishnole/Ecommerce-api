import { verifyToken } from "../utils/verifyToken.js";
import asyncHandler from "express-async-handler";

export const isLoggedIn = asyncHandler(async (req, res, next) => {
  const token = req.headers?.authorization?.split(" ")[1];
  const decodedUser = await verifyToken(token);

  if (!decodedUser) {
    throw new Error("Invalid/Expired token , please login again");
  }

  req.userAuthId = decodedUser.id;

  next();
});
