// server/routes/dashboard.js
const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');

router.get('/', requireAuth, (req, res) => {
  // TODO: implement dashboard stats
  res.json({ message: 'Dashboard - implement metrics' });
});

module.exports = router;
