import Brand from "../models/Brand.js";
import Category from "../models/Category.js";
import Product from "../models/Product.js";
import asyncHandler from "express-async-handler";

//@desc create new product
//@route POST/api/v1/products
//@access private/admin

export const createProduct = asyncHandler(async (req, res) => {
  const image = req.files.map((file) => file.path);
  const {
    name,
    description,
    category,
    sizes,
    colors,
    user,
    price,
    totalQty,
    brand,
  } = req.body;

  const productExists = await Product.findOne({ name });
  if (productExists) {
    throw new Error("Product Already Exists");
  }

  const categoryFound = await Category.findOne({
    name: category.toLowerCase(),
  });

  if (!categoryFound)
    throw new Error(
      "Category not found , please create category first or check category name"
    );

  const brandFound = await Brand.findOne({
    name: brand.toLowerCase(),
  });

  if (!brandFound)
    throw new Error(
      "Brand not found , please create brand first or check brand name"
    );

  const product = await Product.create({
    name,
    description,
    category,
    sizes,
    colors,
    user: req.userAuthId,
    images: image,
    price,
    totalQty,
    brand,
  });

  //push the product into the category
  categoryFound.products.push(product._id);
  //resave
  await categoryFound.save();

  brandFound.products.push(product._id);
  await brandFound.save();
  return res.status(201).json({
    success: true,
    message: " Product created successfully",
    data: product,
  });
});

//@desc Get all products
//@route Get/api/v1/products
//@acess Public
export const getProducts = asyncHandler(async (req, res) => {
  const { name, brand, category, color, size, price } = req.query;

  let productQuery = Product.find();

  if (name) {
    productQuery = productQuery.find({
      name: { $regex: name, $options: "i" },
    });
  }

  if (brand) {
    productQuery = productQuery.find({
      brand: { $regex: brand, $options: "i" },
    });
  }

  if (category) {
    productQuery = productQuery.find({
      category: { $regex: category, $options: "i" },
    });
  }

  if (color) {
    productQuery = productQuery.find({
      colors: { $regex: color, $options: "i" },
    });
  }

  if (size) {
    productQuery = productQuery.find({
      sizes: { $regex: size, $options: "i" },
    });
  }
  if (price) {
    const priceRange = price.split("-");
    productQuery = productQuery.find({
      price: { $gte: priceRange[0], $lte: priceRange[1] },
    });
  }

  //pagination
  //page
  const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;
  //limit
  const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;

  //startIndex
  const startIndex = (page - 1) * limit;

  //endIndex
  const endIndex = page * limit;

  //total
  const total = await Product.countDocuments();

  productQuery = productQuery.skip(startIndex).limit(limit);

  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
      };
    }
  }

  const products = await productQuery.populate("reviews");
  res.status(200).json({
    success: true,
    total,
    results: products.length,
    pagination,
    message: "get products successfully",
    products,
  });
});

//@desc Get Single Product
//@route Get/api/v1/products/:id
//@access  Public

export const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById({ _id: id }).populate("reviews");

  if (!product) {
    throw new Error("Product not found");
  }

  const avgRating = product?.reviews?.reduce((prev, cur) => {
    return prev + cur.rating;
  }, 0);

  res.status(200).json({
    success: true,
    product,
    averageRating: Number(avgRating / product.reviews.length).toFixed(),
    message: "Product fetched successfully",
  });
});

//@desc Update  product
//@route Put/api/v1/products/:id
//@access Private/admin

export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description, category, sizes, colors, price, totalQty, brand } =
    req.body;

  const updatedProduct = await Product.findByIdAndUpdate(
    { _id: id },
    { name, description, category, sizes, colors, price, totalQty, brand },
    { new: true }
  );

  res.status(201).json({
    success: true,
    updatedProduct,
    message: "Product updated successfully",
  });
});

//@desc Delete product
//@route Delete/api/v1/products/:id
// @access Private /admin

export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await Product.findByIdAndDelete({ _id: id });

  res.status(200).json({
    success: false,
    message: "Product deleted successfully",
  });
});
