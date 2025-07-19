import dotenv from "dotenv";
import crypto from "crypto";
import jwt from "jsonwebtoken";

dotenv.config();

export const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const generateRandomSecretKey = (butesNumber) => {
  const secret = crypto.randomBytes(butesNumber).toString("hex");
  console.log("Your JWT_SECRET:", secret);
  return secret;
};
