// server/controllers/authController.js
const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const { logAudit } = require('../services/auditService');

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

  try {
    const [rows] = await pool.query('SELECT u.id, u.username, u.email, u.password_hash, r.name as role FROM users u LEFT JOIN roles r ON u.role_id = r.id WHERE u.email = ? LIMIT 1', [email]);
    if (!rows.length) return res.status(401).json({ message: 'Invalid credentials' });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    // Set session
    req.session.user = { id: user.id, username: user.username, email: user.email, role: user.role, role_id: user.role_id };

    // Update last_login_at
    await pool.query('UPDATE users SET last_login_at = NOW() WHERE id = ?', [user.id]);

    // Audit
    await logAudit({ user_id: user.id, action: 'LOGIN', module: 'auth', record_id: user.id, ip_address: req.ip, user_agent: req.headers['user-agent'] });

    return res.json({ id: user.id, username: user.username, email: user.email, role: user.role });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Login failed' });
  }
}

async function logout(req, res) {
  const userId = req.session && req.session.user && req.session.user.id;
  req.session.destroy(async () => {
    res.clearCookie('erp_session');
    if (userId) {
      await logAudit({ user_id: userId, action: 'LOGOUT', module: 'auth', ip_address: req.ip, user_agent: req.headers['user-agent'] });
    }
    return res.json({ message: 'Logged out' });
  });
}

async function me(req, res) {
  if (req.session && req.session.user) return res.json(req.session.user);
  return res.status(401).json({ message: 'Not authenticated' });
}

module.exports = { login, logout, me };
