// server/routes/receipt.js
const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');

// GET /api/receipt/:saleId
router.get('/:saleId', requireAuth, (req, res) => {
  res.status(501).json({ message: 'Generate receipt (HTML) for sale' });
});

module.exports = router;
