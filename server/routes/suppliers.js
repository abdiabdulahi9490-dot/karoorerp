// server/routes/suppliers.js
const express = require('express');
const router = express.Router();
const { requireAuth, requireAdmin } = require('../middleware/auth');

router.get('/', requireAuth, (req, res) => res.status(501).json({ message: 'Suppliers list' }));
router.post('/', requireAuth, (req, res) => res.status(501).json({ message: 'Create supplier' }));
router.put('/:id', requireAuth, (req, res) => res.status(501).json({ message: 'Update supplier' }));
router.delete('/:id', requireAuth, requireAdmin, (req, res) => res.status(501).json({ message: 'Delete supplier' }));

module.exports = router;
