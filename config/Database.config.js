import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

let mongoUrl = process.env.MONGO_URI;
export const connectDB = async () => {
  try {
    await mongoose.connect(mongoUrl);
    console.log("✅ DB Connected!");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};
