import User from "../models/User.js";

const isAdmin = async (req, res, next) => {
  const user = await User.findById(req.userAuthId);

  if (user.isAdmin) {
    next();
  } else {
    next(new Error("Acccess denied , admin only"));
  }
};

export default isAdmin;
