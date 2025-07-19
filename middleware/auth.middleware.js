import { statusCode } from "../enums/common/StatusCode.enum.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();
export let isAuthenticated = (req, res, next) => {
  let token = req.headers.authorization?.split(" ")[1];

  if (!token)
    res.status(statusCode.UNAUTHORIZED).json({
      data: null,
      msg: "please login or register if you have not an account yet!",
      code: statusCode.UNAUTHORIZED,
    });
  else {
    // check the data inside the token and see the role
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(statusCode.UNAUTHORIZED).json({
        data: null,
        msg: error.message,
        code: statusCode.UNAUTHORIZED,
      });
    }
  }
};
