const { 
    getExistingChatController,
    sendChatQueryController
} = require('../controllers/chatController');

const router = require('express').Router();

router.get('/:session_id', getExistingChatController);
router.post('/:session_id', sendChatQueryController);

module.exports = router;