import { ForbiddenError } from "../../errors/ForbiddenError.error.js";
import { NotFoundError } from "../../errors/NotFoundError.error.js";
import { User } from "../../models/user.model.js";
import { UserResource } from "../../resources/User.resource.js";

export const me = async (data) => {
  const user = await User.findById(data.id).select("-password");
  if (!user) throw new ForbiddenError("Invalid Credentials!");
  return UserResource(user);
};

export const updateProfile = async (data) => {
  // list the details
  let user = await User.findByIdAndUpdate(data.id, data.body);
  if (!user) {
    return NotFoundError("user not found!");
  }
  return UserResource(user);
};
