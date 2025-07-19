import express from "express";
import {
  store,
  storeMerchantPaymentMethod,
  indexByUser,
  index,
  showByUser,
  updateByUser,
  switchPrimaryPaymentMethod,
  destroy,
  pay,
  refund,
} from "../../controllers/payment/PaymentMethod.controller.js";
import {
  storeCustomerPaymentMethodSchema,
  storeMerchantPaymentMethodSchema,
} from "../../validations/payment/StorePaymentMethod.validation.js";
import { updatePaymentMethodSchema } from "../../validations/payment/UpdatePaymentMethod.validation.js";
import { paySchema } from "../../validations/payment/Pay.validation.js";
import { refundSchema } from "../../validations/payment/Refund.validation.js";
import { validation } from "../../middleware/Validation.middleware.js";
import { isBeneficiary } from "../../middleware/IsBeneficiary.middleware.js";
import { customerRole } from "../../middleware/CustomerRole.middleware.js";
import { merchantRole } from "../../middleware/MerchantRole.middleware.js";
import {
  getPaymentMethod,
  defaultPaymentMethod,
} from "../../controllers/payment/StripePaymentMethod.controller.js";

export let paymentRoutes = express.Router();

// add new payment method for customer
paymentRoutes.post(
  "/customers/",
  [customerRole, validation(storeCustomerPaymentMethodSchema)],
  store
);

paymentRoutes.post(
  "/merchants/",
  [merchantRole, validation(storeMerchantPaymentMethodSchema)],
  storeMerchantPaymentMethod
);

// show payment methods by the user
paymentRoutes.get("/me", isBeneficiary, indexByUser);

paymentRoutes.get("/", index);

paymentRoutes.get("/:id", isBeneficiary, showByUser);

paymentRoutes.put(
  "/:id",
  [isBeneficiary, validation(updatePaymentMethodSchema)],
  updateByUser
);

paymentRoutes.put("/switch/:id", isBeneficiary, switchPrimaryPaymentMethod);

paymentRoutes.delete("/:id", isBeneficiary, destroy);

paymentRoutes.put(
  "/stripe/payment-method/:id",
  isBeneficiary,
  getPaymentMethod
);

paymentRoutes.get("/stripe/attach/:id", isBeneficiary, defaultPaymentMethod);

// pay (the main functionality of the system)
paymentRoutes.post("/pay/:id", [customerRole, validation(paySchema)], pay);

// refund takes the transactionId
paymentRoutes.post(
  "/refund/:id",
  [customerRole, validation(refundSchema)],
  refund
);
