// server/routes/purchases.js
const express = require('express');
const router = express.Router();
const { requireAuth, requireAdmin } = require('../middleware/auth');

router.get('/', requireAuth, (req, res) => res.status(501).json({ message: 'Purchases list' }));
router.post('/', requireAuth, (req, res) => res.status(501).json({ message: 'Create purchase' }));
router.get('/:id', requireAuth, (req, res) => res.status(501).json({ message: 'Get purchase' }));
router.delete('/:id', requireAuth, requireAdmin, (req, res) => res.status(501).json({ message: 'Delete purchase' }));

module.exports = router;
