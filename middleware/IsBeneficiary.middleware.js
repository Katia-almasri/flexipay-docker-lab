import { roles } from "../enums/userRole.enum.js";
/**
 * this middleware is to check if the current user role has the
 * permissions to make some actions in the system
 * mainly (merchants & customers) for now
 *  */

export let isBeneficiary = (req, res, next) => {
  if (req.user.role !== roles.CUSTOMER && req.user.role !== roles.MERCHANT)
    return res.status(statusCode.FORBIDDEN).json({
      data: null,
      msg: "you dont have the role!",
      code: statusCode.FORBIDDEN,
    });
  next();
};
