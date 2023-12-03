import asyncHandler from "express-async-handler";
import Review from "../models/Review.js";
import Product from "../models/Product.js";

//@desc create new review
//@route POST/api/v1/reviews
//@access Private/Admin

export const createReview = asyncHandler(async (req, res) => {
  const { message, rating } = req.body;
  const { productID } = req.params;

  const productFound = await Product.findOne({ _id: productID }).populate(
    "reviews"
  );
  if (!productFound) {
    throw new Error("Product Not Found");
  }

  const hasReviewed = productFound?.reviews?.find((review) => {
    return review?.user?.toString() === req?.userAuthId?.toString();
  });

  if (hasReviewed) {
    throw new Error("You have already reviewed this product");
  }

  const review = await Review.create({
    message,
    rating,
    product: productFound?._id,
    user: req.userAuthId,
  });

  productFound.reviews.push(review?._id);

  await productFound.save();

  res.status(201).json({
    success: true,
    message: "Review created successfully",
  });
});
