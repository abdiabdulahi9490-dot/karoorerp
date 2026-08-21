// server/middleware/auth.js
const pool = require('../config/database');

async function attachUser(req, res, next) {
  if (req.session && req.session.user && req.session.user.id) {
    // Optionally refresh user from DB
    try {
      const [rows] = await pool.query('SELECT id, username, email, role_id, status FROM users WHERE id = ? LIMIT 1', [req.session.user.id]);
      if (rows && rows.length) {
        req.user = rows[0];
      } else {
        req.user = null;
      }
    } catch (err) {
      req.user = null;
    }
  }
  next();
}

function requireAuth(req, res, next) {
  if (req.session && req.session.user && req.session.user.id) {
    return next();
  }
  return res.status(401).json({ message: 'Unauthorized' });
}

function requireAdmin(req, res, next) {
  // Simple role check: role_id === 1 is admin by convention in scaffold
  if (req.session && req.session.user && req.session.user.role && (req.session.user.role === 'Admin' || req.session.user.role_id === 1)) {
    return next();
  }
  return res.status(403).json({ message: 'Forbidden - Admins only' });
}

module.exports = { attachUser, requireAuth, requireAdmin };
