import { response } from "../../utils/common/RestfulApi.util.js";
import { statusCode } from "../../enums/common/StatusCode.enum.js";
import {
  getTransactionsByCustomer,
  showTransactionByCustomer,
} from "../../services/payment/Transaction.service.js";
import { paginate, sliceRanges } from "../../utils/common/Paginate.util.js";

export let indexByCustomer = async (req, res) => {
  try {
    console.log(req.query);
    const transactions = await getTransactionsByCustomer(
      req.user.id,
      req.query,
      req.query.order
    );

    const pagination = paginate(transactions, req.query);
    const ranges = sliceRanges(req.query.page ?? 1, pagination.limit);
    return res
      .status(statusCode.OK)
      .json(
        response(
          transactions.slice(ranges.start, ranges.end),
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

export let showByCustomer = async (req, res) => {
  try {
    const transaction = await showTransactionByCustomer(
      req.user.id,
      req.params.id
    );
    if (!transaction)
      return res.status(statusCode.NOT_FOUND).json({
        data: null,
        msg: `transaction #${req.params.id} not found!`,
        status: statusCode.NOT_FOUND,
      });
    return res.status(statusCode.OK).json({
      data: transaction,
      msg: "",
      status: statusCode.OK,
    });
  } catch (error) {
    next(error);
  }
};
