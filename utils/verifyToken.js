import jwt from "jsonwebtoken";

export const verifyToken = async (token) => {
  try {
    const decoded = await jwt.verify(token, process.env.SECRET_KEY);

    return decoded;
  } catch (err) {
    return false;
  }
};
