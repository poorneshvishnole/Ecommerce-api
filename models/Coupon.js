import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);
couponSchema.virtual("isExpired").get(function () {
  return this.endDate < Date.now();
});

couponSchema.virtual("daysLeft").get(function () {
  const daysLeft =
    Math.ceil((this.endDate - Date.now()) / (1000 * 60 * 60 * 24)) +
    " " +
    "Days left";

  return daysLeft;
});

couponSchema.pre("validate", function (next) {
  if (this.endDate < this.startDate) {
    next(new Error("End date cannot be less than the start date"));
  }

  next();
});

couponSchema.pre("validate", function (next) {
  if (this.discount <= 0 || this.discount > 100) {
    next(new Error("Discount cannot be less than 0 or greater than 100"));
  }

  next();
});

couponSchema.pre("validate", function (next) {
  if (this.startDate < Date.now()) {
    next(new Error("Start date cannot be less than today"));
  }
  next();
});
const Coupon = mongoose.model("Coupon", couponSchema);
export default Coupon;
