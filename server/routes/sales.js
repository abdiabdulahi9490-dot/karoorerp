// server/routes/sales.js
const express = require('express');
const router = express.Router();
const { requireAuth, requireAdmin } = require('../middleware/auth');

router.get('/', requireAuth, (req, res) => res.status(501).json({ message: 'Sales list' }));
router.post('/', requireAuth, (req, res) => res.status(501).json({ message: 'Create sale' }));
router.get('/:id', requireAuth, (req, res) => res.status(501).json({ message: 'Get sale' }));
router.delete('/:id', requireAuth, requireAdmin, (req, res) => res.status(501).json({ message: 'Delete sale' }));

module.exports = router;
