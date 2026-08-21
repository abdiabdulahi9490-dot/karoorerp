// server/routes/customers.js
const express = require('express');
const router = express.Router();
const { requireAuth, requireAdmin } = require('../middleware/auth');

router.get('/', requireAuth, (req, res) => res.status(501).json({ message: 'Customers list' }));
router.post('/', requireAuth, (req, res) => res.status(501).json({ message: 'Create customer' }));
router.put('/:id', requireAuth, (req, res) => res.status(501).json({ message: 'Update customer' }));
router.delete('/:id', requireAuth, requireAdmin, (req, res) => res.status(501).json({ message: 'Delete customer' }));

module.exports = router;
