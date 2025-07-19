import { roles } from "../enums/userRole.enum.js";
import { statusCode } from "../enums/common/StatusCode.enum.js";

export let customerRole = (req, res, next) => {
  if (req.user.role !== roles.CUSTOMER)
    return res.status(statusCode.FORBIDDEN).json({
      data: null,
      msg: "you dont have the role!",
      code: statusCode.FORBIDDEN,
    });
  next();
};
