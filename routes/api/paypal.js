import express from "express";
import { customerRole } from "../../middleware/CustomerRole.middleware.js";
import { capture } from "../../controllers/payment/PaypalPayment.controller.js";

export let paypalRoutes = express.Router();

paypalRoutes.get("/capture", customerRole, capture);
