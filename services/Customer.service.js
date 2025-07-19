import { User } from "../models/user.model.js";
import { UserResource } from "../resources/User.resource.js";

export let me = async (data) => {
  // return the current authenticated customer info
  try {
    const user = await User.findById(data.id).select("-password");
    if (!user) throw new Error();
    return UserResource(user);
  } catch (err) {
    return null;
  }
};

export let updateProfile = async (data) => {
  try {
    // list the details
    let user = await User.findByIdAndUpdate(data.id, data.body);
    if (!user) {
      return null;
    }
    return UserResource(user);
  } catch (error) {
    return null;
  }
};
