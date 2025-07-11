/**
 * Restrict access to routes based on user role.
 * @param  {...string} allowedRoles - Roles that can access this route
 */
export default function authorizeRole(...allowedRoles) {
  return (req, res, next) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient role' });
    }

    next();
  };
}
