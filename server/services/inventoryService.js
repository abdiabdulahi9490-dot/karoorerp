// server/services/inventoryService.js
const pool = require('../config/database');

async function adjustStock(productId, change, type, reference_module, reference_id, user_id) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query('UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?', [change, productId]);
    await conn.query('INSERT INTO stock_movements (product_id, change, type, reference_module, reference_id, created_by) VALUES (?, ?, ?, ?, ?, ?)', [
      productId, change, type, reference_module, reference_id, user_id
    ]);
    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

module.exports = { adjustStock };
