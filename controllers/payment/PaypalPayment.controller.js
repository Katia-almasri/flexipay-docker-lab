import { captureOrder } from "../../services/payment/Paypal.service.js";
import { statusCode } from "../../enums/common/StatusCode.enum.js";
import { implementWebhook } from "../../services/payment/Paypal.service.js";
import dotenv from "dotenv";

dotenv.config();

export let capture = async (req, res) => {
  try {
    const { token } = req.query;

    const capture = await captureOrder(token);

    return res.status(statusCode.OK).json({
      data: capture,
      msg: "Payment captured!",
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

export let paypalWebhook = async (req, res) => {
  const headers = req.headers;
  console.log("webhook");
  const verificationBody = {
    auth_algo: headers["paypal-auth-algo"],
    cert_url: headers["paypal-cert-url"],
    transmission_id: headers["paypal-transmission-id"],
    transmission_sig: headers["paypal-transmission-sig"],
    transmission_time: headers["paypal-transmission-time"],
    webhook_id: process.env.PAYPAL_WEBHOOK_ID,
    webhook_event: JSON.parse(req.rawBody.toString()),
  };
  try {
    const data = {
      verificationBody: verificationBody,
      body: req.body,
    };
    const result = await implementWebhook(data);

    return res.status(statusCode.OK).json({
      data: result,
      msg: "",
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
