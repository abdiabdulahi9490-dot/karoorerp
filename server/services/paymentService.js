// server/services/paymentService.js
const pool = require('../config/database');

async function recordPayment(module, module_id, amount, method, created_by) {
  const [res] = await pool.query('INSERT INTO payments (module, module_id, amount, method, created_by) VALUES (?, ?, ?, ?, ?)', [
    module, module_id, amount, method, created_by
  ]);
  return res.insertId;
}

module.exports = { recordPayment };
