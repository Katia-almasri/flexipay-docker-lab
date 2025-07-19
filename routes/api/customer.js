import express from "express";
import { customerRole } from "../../middleware/CustomerRole.middleware.js";
import { show, update } from "../../controllers/CustomerProfile.controller.js";

export let customerRoutes = express.Router();

// me
customerRoutes.get("/", customerRole, show);

// update
customerRoutes.put("/", customerRole, update);
