import { catchAsync } from "../utils/errors/CatchAsync.util.js";
import { me, updateProfile } from "../services/merchant/Merchant.service.js";
import { statusCode } from "../enums/common/StatusCode.enum.js";

export let show = catchAsync(async (req, res) => {
  let user = await me(req.user);
  return res.status(statusCode.OK).json({
    data: user,
    msg: "",
    status: statusCode.OK,
  });
});

export const update = catchAsync(async (req, res) => {
  const data = {
    id: req.user.id,
    body: req.body,
  };
  const user = await updateProfile(data);
  return res.status(statusCode.OK).json({
    data: user,
    msg: "",
    status: statusCode.OK,
  });
});
