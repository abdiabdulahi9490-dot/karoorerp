// server/routes/expenses.js
const express = require('express');
const router = express.Router();
const { requireAuth, requireAdmin } = require('../middleware/auth');

router.get('/', requireAuth, (req, res) => res.status(501).json({ message: 'Expenses list' }));
router.post('/', requireAuth, (req, res) => res.status(501).json({ message: 'Create expense' }));
router.put('/:id', requireAuth, (req, res) => res.status(501).json({ message: 'Update expense' }));
router.delete('/:id', requireAuth, requireAdmin, (req, res) => res.status(501).json({ message: 'Delete expense' }));

module.exports = router;
