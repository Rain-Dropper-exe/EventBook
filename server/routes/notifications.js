const express = require('express');
const auth = require('../middleware/auth');
const { getMyNotifications, markAllRead } = require('../controllers/notificationController');

const router = express.Router();
router.use(auth); // Requires login

router.get('/my', getMyNotifications);
router.patch('/read-all', markAllRead);

module.exports = router;
