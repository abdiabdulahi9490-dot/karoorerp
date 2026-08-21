// server/services/auditService.js
const pool = require('../config/database');

async function logAudit({ user_id, action, module, record_id, record_data, ip_address, user_agent }) {
  try {
    await pool.query('INSERT INTO audit_logs (user_id, action, module, record_id, record_data, ip_address, user_agent) VALUES (?, ?, ?, ?, ?, ?, ?)', [
      user_id || null,
      action,
      module,
      record_id ? String(record_id) : null,
      record_data ? JSON.stringify(record_data) : null,
      ip_address || null,
      user_agent || null
    ]);
  } catch (err) {
    console.error('Failed to write audit log', err);
  }
}

module.exports = { logAudit };
