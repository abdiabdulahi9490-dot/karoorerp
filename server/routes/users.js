// server/routes/users.js
const express = require('express');
const router = express.Router();
const { requireAuth, requireAdmin } = require('../middleware/auth');
const userController = require('../controllers/userController');

router.get('/', requireAuth, userController.listUsers);
router.post('/', requireAuth, requireAdmin, userController.createUser);
router.put('/:id', requireAuth, requireAdmin, userController.updateUser);
router.delete('/:id', requireAuth, requireAdmin, userController.deleteUser);
router.post('/:id/reset-password', requireAuth, requireAdmin, userController.resetPassword);
router.post('/change-password', requireAuth, userController.changePassword);

module.exports = router;
