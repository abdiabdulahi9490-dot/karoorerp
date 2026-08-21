// server/routes/reports.js
const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');

router.get('/', requireAuth, (req, res) => res.status(501).json({ message: 'Reports list' }));

module.exports = router;
