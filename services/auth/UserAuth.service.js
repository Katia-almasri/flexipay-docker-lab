import { User } from "../../models/user.model.js";
import { generateToken } from "../../utils/auth/GenerateToken.util.js";
import { UserResource } from "../../resources/User.resource.js";
import { roles } from "../../enums/userRole.enum.js";
import { Merchant } from "../../models/Merchant.model.js";
import { currencyTypes } from "../../enums/CurrencyType.enum.js";

export let create = async (data) => {
  const { username, email, password, role } = data;
  const user = await User.create({ username, email, password, role });
  console.log(user);
  // if the user role is merchant then create the merchant instance
  if (role == roles.MERCHANT) {
    const merchant = await Merchant.create({
      merchantId: user._id,
      accountHolderName: data.credentials.account_holder_name,
      iban: data.credentials.iban,
      swift: data.credentials.swift,
      accountNumber: data.credentials.accountNumber,
      currency: currencyTypes.USD,
      balance: 0,
    });
  }
  const token = generateToken(user);
  return { token: token, user: UserResource(user) };
};

export let checkUserExistence = async (data) => {
  // get the data from it
  const email = data.email;
  const password = data.password;

  // check if exists in database
  let user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return null;
  } else {
    const token = generateToken(user);
    return { token: token, user: UserResource(user) };
  }
};

export let changePassword = async (data) => {
  const { oldPassword, newPassword } = data.body;
  let user = await User.findById(data.id);
  if (!user || !(await user.comparePassword(oldPassword))) {
    throw new Error("wrong password!");
  }

  // change password
  user = await User.findByIdAndUpdate(data.id, { password: newPassword });
  return UserResource(user);
};

export let forgetPassword = async (data) => {
  //TODO when link with email
};

export let resetPassword = async (data) => {
  //TODO when link with email
};
