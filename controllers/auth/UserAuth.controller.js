import {
  create,
  checkUserExistence,
  changePassword,
} from "../../services/auth/UserAuth.service.js";
import { statusCode } from "../../enums/common/StatusCode.enum.js";

export let registerUser = async (req, res) => {
  try {
    let data = await create(req.body);
    res.status(statusCode.CREATED).json({
      data: data,
      msg: "user created successfully!",
      status: statusCode.CREATED,
    });
  } catch (err) {
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      data: null,
      msg: err.message,
      status: statusCode.INTERNAL_SERVER_ERROR,
    });
  }
};

export let login = async (req, res) => {
  try {
    let loggedUser = await checkUserExistence(req.body);
    if (!loggedUser) {
      return res.status(statusCode.UNAUTHORIZED).json({
        data: null,
        msg: "un authenticated user!",
        status: statusCode.UNAUTHORIZED,
      });
    }

    return res.status(statusCode.OK).json({
      data: loggedUser,
      msg: "user logged in successfully!",
      status: statusCode.OK,
    });
  } catch (error) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      data: null,
      msg: err.message,
      status: statusCode.INTERNAL_SERVER_ERROR,
    });
  }
};

export let resetPassword = async (req, res) => {
  try {
    const data = {
      id: req.user.id,
      body: {
        oldPassword: req.body.old_password,
        newPassword: req.body.new_password,
      },
    };
    let user = await changePassword(data);
    if (!user)
      throw new Error("some error hapened while resetting the password!");

    return res.status(statusCode.OK).json({
      data: user,
      logout: true,
      msg: "password resat successfully, please login again!",
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

export let logout = async (req, res) => {
  return res.status(statusCode.OK).json({
    data: {
      logout: true,
    },
    msg: "logged out successfully",
    status: statusCode.OK,
  });
};
