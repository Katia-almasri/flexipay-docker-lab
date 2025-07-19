import express from "express";
import { merchantRole } from "../../middleware/MerchantRole.middleware.js";
import { show, update } from "../../controllers/MerchantProfile.controller.js";

export const merchantRoutes = express.Router();

// me
merchantRoutes.get("/", merchantRole, show);

// update
merchantRoutes.put("/", merchantRole, update);
