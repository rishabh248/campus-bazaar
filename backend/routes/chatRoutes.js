const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  startConversation,
  getMyConversations,
  getMessages,
} = require('../controllers/chatController');

// All routes in this file are protected
router.use(protect);

router.route('/').post(startConversation).get(getMyConversations);
router.route('/:id/messages').get(getMessages);

module.exports = router;