// server/controllers/userController.js
const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const { logAudit } = require('../services/auditService');

// List users (requires auth)
async function listUsers(req, res) {
  try {
    const [rows] = await pool.query('SELECT u.id, u.username, u.email, u.status, r.name as role, u.created_at FROM users u LEFT JOIN roles r ON u.role_id = r.id ORDER BY u.created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to list users' });
  }
}

// Create user (Admin only)
async function createUser(req, res) {
  const { username, email, password, role } = req.body;
  if (!username || !email || !password || !role) return res.status(400).json({ message: 'username, email, password and role are required' });

  try {
    // find role id
    const [rrows] = await pool.query('SELECT id, name FROM roles WHERE name = ? LIMIT 1', [role]);
    if (!rrows.length) return res.status(400).json({ message: 'Invalid role' });
    const roleId = rrows[0].id;

    const password_hash = await bcrypt.hash(password, 12);
    const [resu] = await pool.query('INSERT INTO users (username, email, password_hash, role_id) VALUES (?, ?, ?, ?)', [username, email, password_hash, roleId]);

    await logAudit({ user_id: req.session.user && req.session.user.id, action: 'CREATE', module: 'users', record_id: resu.insertId, record_data: { username, email, role }, ip_address: req.ip, user_agent: req.headers['user-agent'] });

    res.status(201).json({ id: resu.insertId, username, email, role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create user' });
  }
}

// Update user (Admin only)
async function updateUser(req, res) {
  const id = req.params.id;
  const { username, email, role, status } = req.body;
  try {
    const updates = [];
    const params = [];
    if (username) { updates.push('username = ?'); params.push(username); }
    if (email) { updates.push('email = ?'); params.push(email); }
    if (status) { updates.push('status = ?'); params.push(status); }
    if (role) {
      const [rrows] = await pool.query('SELECT id FROM roles WHERE name = ? LIMIT 1', [role]);
      if (!rrows.length) return res.status(400).json({ message: 'Invalid role' });
      updates.push('role_id = ?'); params.push(rrows[0].id);
    }
    if (!updates.length) return res.status(400).json({ message: 'No updates provided' });
    params.push(id);
    await pool.query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, params);

    await logAudit({ user_id: req.session.user && req.session.user.id, action: 'UPDATE', module: 'users', record_id: id, record_data: req.body, ip_address: req.ip, user_agent: req.headers['user-agent'] });

    res.json({ message: 'User updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update user' });
  }
}

// Delete user (Admin only) - protect against deleting last active admin
async function deleteUser(req, res) {
  const id = parseInt(req.params.id, 10);
  try {
    // check if user exists
    const [urows] = await pool.query('SELECT id, role_id, status FROM users WHERE id = ? LIMIT 1', [id]);
    if (!urows.length) return res.status(404).json({ message: 'User not found' });
    const user = urows[0];

    // check if user is admin
    const [rrows] = await pool.query('SELECT name FROM roles WHERE id = ? LIMIT 1', [user.role_id]);
    const roleName = rrows.length ? rrows[0].name : null;

    if (roleName === 'Admin' && user.status === 'active') {
      // count other active admins
      const [countRows] = await pool.query("SELECT COUNT(*) as cnt FROM users u JOIN roles r ON u.role_id = r.id WHERE r.name='Admin' AND u.status='active' AND u.id != ?", [id]);
      const cnt = countRows[0].cnt || 0;
      if (cnt < 1) {
        return res.status(400).json({ message: 'Cannot delete the last active Admin' });
      }
    }

    // perform safe delete: keep audit log with record data
    // fetch current user data for audit
    const [fullRows] = await pool.query('SELECT id, username, email, role_id, status, created_at FROM users WHERE id = ? LIMIT 1', [id]);
    const recordData = fullRows.length ? fullRows[0] : null;

    await pool.query('DELETE FROM users WHERE id = ?', [id]);

    await logAudit({ user_id: req.session.user && req.session.user.id, action: 'DELETE', module: 'users', record_id: id, record_data: recordData, ip_address: req.ip, user_agent: req.headers['user-agent'] });

    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete user' });
  }
}

// Reset password (Admin only)
async function resetPassword(req, res) {
  const id = req.params.id;
  const { newPassword } = req.body;
  if (!newPassword) return res.status(400).json({ message: 'newPassword is required' });
  try {
    const password_hash = await bcrypt.hash(newPassword, 12);
    await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [password_hash, id]);

    await logAudit({ user_id: req.session.user && req.session.user.id, action: 'USER_CHANGE', module: 'users', record_id: id, record_data: { reset: true }, ip_address: req.ip, user_agent: req.headers['user-agent'] });

    res.json({ message: 'Password reset' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to reset password' });
  }
}

// Change own password
async function changePassword(req, res) {
  const userId = req.session.user && req.session.user.id;
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) return res.status(400).json({ message: 'currentPassword and newPassword are required' });
  try {
    const [rows] = await pool.query('SELECT password_hash FROM users WHERE id = ? LIMIT 1', [userId]);
    if (!rows.length) return res.status(404).json({ message: 'User not found' });
    const user = rows[0];
    const match = await bcrypt.compare(currentPassword, user.password_hash);
    if (!match) return res.status(401).json({ message: 'Current password is incorrect' });
    const password_hash = await bcrypt.hash(newPassword, 12);
    await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [password_hash, userId]);

    await logAudit({ user_id: userId, action: 'USER_CHANGE', module: 'users', record_id: userId, record_data: { password_changed: true }, ip_address: req.ip, user_agent: req.headers['user-agent'] });

    res.json({ message: 'Password changed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to change password' });
  }
}

module.exports = { listUsers, createUser, updateUser, deleteUser, resetPassword, changePassword };
