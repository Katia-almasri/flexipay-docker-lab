import { addCredentialsToPaymentMethod } from "../../services/payment/PaymentMethod.service.js";
import { statusCode } from "../../enums/common/StatusCode.enum.js";
import {
  makeDefaultStripePaymentMethod,
  implementWebhook,
} from "../../services/payment/Stripe.service.js";
import { catchAsync } from "../../utils/errors/CatchAsync.util.js";

export let getPaymentMethod = catchAsync(async (req, res) => {
  // store is in the user`s corresponding payment method
  const updatedPaymentMethod = await addCredentialsToPaymentMethod(
    req.user.id,
    {
      id: req.params.id,
      stripePaymentMethod: req.body,
    }
  );
  return res.status(statusCode.OK).json({
    data: updatedPaymentMethod,
    msg: `payment method ${updatedPaymentMethod.type} credentials has updated successfully!`,
    status: statusCode.OK,
  });
});

export let defaultPaymentMethod = async (req, res) => {
  try {
    await makeDefaultStripePaymentMethod(req.user.id, req.params.id);
    return res.status(statusCode.OK).json({
      data: null,
      msg: "the payment method attached successfully to the customer",
      status: statusCode.OK,
    });
  } catch (error) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      data: null,
      msg: error.message,
      status: statusCode.INTERNAL_SERVER_ERROR,
    });
  }
};

export let stripeWebhook = async (req, res) => {
  try {
    const sign = req.headers["stripe-signature"];
    const result = await implementWebhook(req.body, sign);
    return res.status(statusCode.OK).json({
      data: result,
      msg: "",
      status: statusCode.OK,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      data: null,
      msg: error.message,
      status: statusCode.INTERNAL_SERVER_ERROR,
    });
  }
};
