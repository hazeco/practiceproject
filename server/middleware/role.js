// Middleware to check user role and permissions
module.exports = (roles = [], permissions = []) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient role' });
    }
    if (permissions.length && !permissions.every(p => req.user.permissions.includes(p))) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    next();
  };
};
