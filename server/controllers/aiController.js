const { GoogleGenerativeAI } = require('@google/generative-ai');
const QuizScore = require('../models/QuizScore');

const MAX_INPUT_CHARS = 8000;

const getModel = () => {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    return genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
};

const normalizeContent = (text) =>
    text && text.length > MAX_INPUT_CHARS ? text.slice(0, MAX_INPUT_CHARS) + '\n[Truncated]' : text || '';

const parseJSONResponse = (text) => {
    const clean = text.replace(/```json/g, '').replace(/```/g, '').trim();
    try {
        return JSON.parse(clean);
    } catch {
        const match = clean.match(/\[\s*\{[\s\S]*\}\s*\]/);
        if (match) return JSON.parse(match[0]);
        throw new Error('Invalid AI JSON format');
    }
};

const summarize = async (req, res) => {
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: 'content is required' });

    const model = getModel();
    const prompt = `Summarize the following study notes into 4-6 concise bullet points.
Keep each bullet short and high signal. Return plain text bullet points only.
Notes:
${normalizeContent(content)}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return res.json({ summary: text });
};

const generateQuiz = async (req, res) => {
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: 'content is required' });

    const model = getModel();
    const prompt = `You are creating a quiz from study notes.
Generate exactly 5 multiple-choice questions based ONLY on the notes.
Return a JSON array with 5 objects:
[
  {"id":1,"question":"...","options":["A","B","C","D"],"correctAnswer":"..."}
]
Rules: 4 options, only one correct answer, ids must be 1-5, no extra text outside JSON.
Notes:
${normalizeContent(content)}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const questions = parseJSONResponse(text);
    return res.json({ questions });
};

const saveScore = async (req, res) => {
    const { score, total, subject, noteId } = req.body;

    if (score === undefined || total === undefined) {
        return res.status(400).json({ message: 'score and total are required' });
    }

    const quizScore = await QuizScore.create({
        user: req.user._id,
        score,
        total,
        subject: subject || 'Practice Quiz',
        noteId: noteId || null,
    });

    return res.status(201).json(quizScore);
};

const getScores = async (req, res) => {
    const scores = await QuizScore.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.json(scores);
};

module.exports = { summarize, generateQuiz, saveScore, getScores };
