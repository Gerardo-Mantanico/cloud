export const ComponentAdmin = ({ user, children }) => {
  if (!user.is_admin) return null;
  return children;
};
