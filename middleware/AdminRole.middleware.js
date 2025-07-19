import { roles } from "../enums/userRole.enum.js";
import { statusCode } from "../enums/common/StatusCode.enum.js";

export let adminRole = (req, res, next) => {
  if (req.user.role !== roles.ADMIN)
    return res.status(statusCode.FORBIDDEN).json({
      data: null,
      msg: "you dont have the role!",
      code: statusCode.FORBIDDEN,
    });
  next();
};
