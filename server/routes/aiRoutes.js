const express = require('express');
const router = express.Router();
const { summarize, generateQuiz, saveScore, getScores } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/summarize', summarize);
router.post('/quiz', generateQuiz);
router.route('/scores').get(getScores).post(saveScore);

module.exports = router;
