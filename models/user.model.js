import mongoose from "mongoose";
import { roles } from "../enums/userRole.enum.js";
import { paymentMethodSchema } from "./PaymentMethod.model.js";
import bcrypt from "bcrypt";

export const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(roles),
      required: true,
      default: roles.CUSTOMER,
    },
    paymentMethods: [paymentMethodSchema],
  },
  {
    timestamps: true,
  }
);

// preprocessing for the password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();

  if (update.password) {
    const hashed = await bcrypt.hash(update.password, 10);
    update.password = hashed;
    this.setUpdate(update);
  }

  next();
});

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

export const User = mongoose.model("User", userSchema);
