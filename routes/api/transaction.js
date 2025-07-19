import express from "express";
import { customerRole } from "../../middleware/CustomerRole.middleware.js";
import {
  indexByCustomer,
  showByCustomer,
} from "../../controllers/payment/Transaction.controller.js";

export let transactionRoutes = express.Router();
transactionRoutes.get("/", customerRole, indexByCustomer);
transactionRoutes.get("/:id", customerRole, showByCustomer);
