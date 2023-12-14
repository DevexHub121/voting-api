const express = require('express')
const router = express.Router()
const { getAllVotes, createPollVote, getVote } = require('../controllers/votes/votesController');
//const { protect } = require('../middleware/authMiddleware');

router.post('/pole-vote', createPollVote);
router.get('/getAll-votes', getAllVotes);
router.get('/get-vote/:id/', getVote);
//router.post('/me', protect, getMe);

module.exports = router