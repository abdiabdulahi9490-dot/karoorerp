// server/routes/inventory.js
const express = require('express');
const router = express.Router();
const { requireAuth, requireAdmin } = require('../middleware/auth');

// GET /api/products
router.get('/', requireAuth, (req, res) => {
  res.status(501).json({ message: 'Products listing not yet implemented' });
});

// POST /api/products
router.post('/', requireAuth, (req, res) => {
  res.status(501).json({ message: 'Create product not yet implemented' });
});

// PUT /api/products/:id
router.put('/:id', requireAuth, (req, res) => {
  res.status(501).json({ message: 'Update product not yet implemented' });
});

// DELETE /api/products/:id (Admin only - backend enforced)
router.delete('/:id', requireAuth, requireAdmin, (req, res) => {
  res.status(501).json({ message: 'Delete product not yet implemented' });
});

module.exports = router;
