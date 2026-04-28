const express = require('express');
const router = express.Router();
const { summarize, generateQuiz, generateTable, rewrite, chat, saveScore, getScores } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/summarize', summarize);
router.post('/quiz', generateQuiz);
router.post('/table', generateTable);
router.post('/rewrite', rewrite);
router.post('/chat', chat);
router.route('/scores').get(getScores).post(saveScore);

module.exports = router;
