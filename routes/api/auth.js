import express from "express";
import {
  registerUser,
  login,
  resetPassword,
  logout,
} from "../../controllers/auth/UserAuth.controller.js";
import { loginSchema } from "../../validations/auth/Login.validation.js";
import { resetPasswordSchema } from "../../validations/auth/ResetPassword.validation.js";
import { RegisterUserSchema } from "../../validations/auth/Register.validation.js";
import { validation } from "../../middleware/Validation.middleware.js";
import { isAuthenticated } from "../../middleware/auth.middleware.js";

export let authRoutes = express.Router();

// register
authRoutes.post("/register", validation(RegisterUserSchema), registerUser);

//login
authRoutes.post("/login", validation(loginSchema), login);

// reset password
authRoutes.put(
  "/reset-password",
  [isAuthenticated, validation(resetPasswordSchema)],
  resetPassword
);

// logout
authRoutes.get("/logout", isAuthenticated, logout);
