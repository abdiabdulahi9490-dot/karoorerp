// server/routes/accounting.js
const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');

router.get('/', requireAuth, (req, res) => res.status(501).json({ message: 'Accounting endpoints' }));

module.exports = router;
