// server/routes/users.js
const express = require('express');
const router = express.Router();
const { requireAuth, requireAdmin } = require('../middleware/auth');

router.get('/', requireAuth, (req, res) => res.status(501).json({ message: 'Users list' }));
router.post('/', requireAuth, requireAdmin, (req, res) => res.status(501).json({ message: 'Create user' }));
router.put('/:id', requireAuth, requireAdmin, (req, res) => res.status(501).json({ message: 'Update user' }));
router.delete('/:id', requireAuth, requireAdmin, (req, res) => res.status(501).json({ message: 'Delete user' }));

module.exports = router;
