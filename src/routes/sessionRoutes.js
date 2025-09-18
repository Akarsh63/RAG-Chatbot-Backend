const { 
    createSessionController,
    deleteSessionController
 } = require('../controllers/sessionController');

const router = require('express').Router();

router.post('/create', createSessionController);
router.delete('/:session_id', deleteSessionController);

module.exports = router;