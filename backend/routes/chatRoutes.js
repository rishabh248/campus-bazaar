const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  startConversation,
  getMyConversations,
  getMessages,
} = require('../controllers/chatController');

router.use(protect);

router.post('/', startConversation);
router.get('/', getMyConversations);
router.get('/:id/messages', getMessages);

module.exports = router;
