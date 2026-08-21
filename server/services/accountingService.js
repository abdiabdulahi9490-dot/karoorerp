// server/services/accountingService.js
const pool = require('../config/database');

async function createTransaction(entries, memo) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [res] = await conn.query('INSERT INTO transactions (transaction_number, memo) VALUES (?, ?)', [
      'TX-' + Date.now(), memo || null
    ]);
    const transactionId = res.insertId;
    for (const e of entries) {
      await conn.query('INSERT INTO transaction_entries (transaction_id, account_id, debit, credit) VALUES (?, ?, ?, ?)', [
        transactionId, e.account_id, e.debit || 0, e.credit || 0
      ]);
    }
    await conn.commit();
    return transactionId;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

module.exports = { createTransaction };
