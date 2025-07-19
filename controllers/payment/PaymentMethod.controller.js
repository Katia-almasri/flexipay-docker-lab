import {
  addPaymentMethod,
  getPaymentMethodsByUser,
  getPaymentMethods,
  showPaymentMethodByUser,
  updatePaymentMethodByUser,
  switchPrimaryPaymentMethodById,
  deletePaymentMethodById,
  performPayment,
  performRefund,
} from "../../services/payment/PaymentMethod.service.js";
import { statusCode } from "../../enums/common/StatusCode.enum.js";
import { paginate, sliceRanges } from "../../utils/common/Paginate.util.js";
import { response } from "../../utils/common/RestfulApi.util.js";
import { currencyTypes } from "../../enums/CurrencyType.enum.js";
import { catchAsync } from "../../utils/errors/CatchAsync.util.js";

export let store = catchAsync(async (req, res) => {
  const data = {
    type: req.body.type,
    credentials: req.body.credentials,
    isPrimary: req.body.is_primary,
  };
  let paymentMethod = await addPaymentMethod(req.user.id, data);
  return res.status(statusCode.OK).json({
    data: paymentMethod,
    status: statusCode.OK,
    msg: "new payment method just added to you!",
  });
});

export let storeMerchantPaymentMethod = catchAsync(async (req, res) => {
  const data = {
    type: req.body.type,
    credentials: req.body.credentials,
    isPrimary: req.body.is_primary,
  };
  let paymentMethod = await addPaymentMethod(req.user.id, data);
  return res.status(statusCode.OK).json({
    data: paymentMethod,
    status: statusCode.OK,
    msg: "new payment method just added to you!",
  });
});

export let indexByUser = async (req, res) => {
  try {
    const paymentMethods = await getPaymentMethodsByUser(
      req.user.id,
      req.query
    );

    const pagination = paginate(paymentMethods, req.query);
    const ranges = sliceRanges(req.query.page ?? 1, pagination.limit);
    return res
      .status(statusCode.OK)
      .json(
        response(
          paymentMethods.slice(ranges.start, ranges.end),
          "Fetched successfully",
          statusCode.OK,
          pagination
        )
      );
  } catch (error) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      data: null,
      msg: error.message,
      status: statusCode.INTERNAL_SERVER_ERROR,
      pagination: null,
    });
  }
};

// show payment methods that used in the system (list them)
export let index = async (req, res) => {
  const paymentMethods = await getPaymentMethods();
  return res.status(statusCode.OK).json({
    data: paymentMethods,
    msg: "",
    status: statusCode.OK,
  });
};

export let showByUser = async (req, res) => {
  let paymentMethod = await showPaymentMethodByUser(req.user.id, req.params.id);
  if (!paymentMethod)
    return res.status(statusCode.NOT_FOUND).json({
      data: null,
      msg: "this payment method not found!",
      status: statusCode.NOT_FOUND,
    });

  return res.status(statusCode.OK).json({
    data: paymentMethod,
    msg: "",
    status: statusCode.OK,
  });
};

export let updateByUser = async (req, res) => {
  try {
    const data = {
      id: req.params.id,
      ...req.body,
    };

    let paymentMethod = await updatePaymentMethodByUser(req.user.id, data);
    return res.status(statusCode.OK).json({
      data: paymentMethod,
      msg: `payment method ${paymentMethod.type} credentials has updated successfully!`,
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

export let switchPrimaryPaymentMethod = async (req, res) => {
  try {
    let paymentMethod = await switchPrimaryPaymentMethodById(
      req.user.id,
      req.params.id
    );
    return res.status(statusCode.OK).json({
      data: paymentMethod,
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

export let destroy = async (req, res) => {
  try {
    let paymentMethod = await deletePaymentMethodById(
      req.user.id,
      req.params.id
    );
    if (!paymentMethod)
      return res.status(statusCode.NOT_FOUND).json({
        data: null,
        msg: "payment method not found!",
        status: statusCode.NOT_FOUND,
      });
    return res.status(statusCode.OK).json({
      data: paymentMethod,
      msg: "payment method removed successfully",
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

export let pay = catchAsync(async (req, res) => {
  const paymentMethodId = req.params.id;
  const userId = req.user.id;
  const data = {
    amount: req.body.amount,
    merchantId: req.body.merchant_id,
    currency: req.body.currency ?? currencyTypes.USD,
    returnUrl: req.body.return_url ?? "",
    cancelUrl: req.body.cancel_url ?? "",
  };
  const result = await performPayment(userId, paymentMethodId, data);
  return res.status(statusCode.OK).json({
    data: result,
    msg: "payment succeed!",
    status: statusCode.OK,
  });
});

export let refund = catchAsync(async (req, res) => {
  const result = await performRefund(req.params.id, req.body);
  return res.status(statusCode.OK).json({
    data: result,
    msg: "refund succeed!",
    status: statusCode.OK,
  });
});
