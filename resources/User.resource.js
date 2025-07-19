export const UserResource = (user) => {
  return {
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    created_at: user.created_at,
  };
};
