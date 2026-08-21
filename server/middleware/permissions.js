// server/middleware/permissions.js
// Placeholder for granular permission checks. Implement permission lookup against roles/permissions.

function hasPermission(permission) {
  return (req, res, next) => {
    // TODO: Check req.session.user permissions
    // For now allow if admin
    if (req.session && req.session.user && (req.session.user.role === 'Admin' || req.session.user.role_id === 1)) {
      return next();
    }
    // Otherwise deny
    return res.status(403).json({ message: 'Forbidden' });
  };
}

module.exports = { hasPermission };
