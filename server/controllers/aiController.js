const { GoogleGenerativeAI } = require('@google/generative-ai');
const QuizScore = require('../models/QuizScore');

const MAX_INPUT_CHARS = 8000;

// Free-tier Google AI Studio models, tried in order.
// 1.5 models removed — they return 404 on v1beta as of 2025.
const FREE_MODELS = [
    'gemini-2.5-flash',
    'gemini-2.5-flash-lite',
    'gemini-2.0-flash',
    'gemini-2.0-flash-lite',
    'gemini-2.5-pro',
    'gemini-2.0-flash-exp',
    'gemini-2.0-flash-thinking-exp',
];

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

// Tries each model in FREE_MODELS until one succeeds, logs every failure.
// 404 = model not found/deprecated → skip immediately.
// 429 = quota hit → log quota details and skip to next model.
const generateWithFallback = async (prompt, action) => {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    let lastError;

    for (const modelName of FREE_MODELS) {
        try {
            console.log(`[AI:${action}] Trying model: ${modelName}`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent(prompt);
            const text = result.response.text();
            console.log(`[AI:${action}] ✓ Success with model: ${modelName}`);
            return text;
        } catch (err) {
            const status = err?.status ?? err?.httpError ?? 'unknown';
            const reason = err?.message ?? String(err);

            if (status === 404) {
                console.warn(`[AI:${action}] SKIP model=${modelName} — not found or deprecated (404)`);
            } else if (status === 429) {
                // Extract retry delay if present
                const retryMatch = reason.match(/retry in ([0-9.]+s)/i);
                const retryHint = retryMatch ? ` (retry after ${retryMatch[1]})` : '';
                console.warn(`[AI:${action}] QUOTA EXCEEDED model=${modelName}${retryHint} — trying next model`);
            } else {
                console.error(`[AI:${action}] FAILED model=${modelName} status=${status} reason=${reason}`);
            }

            lastError = err;
        }
    }

    console.error(`[AI:${action}] All models exhausted. Last error:`, lastError);
    throw lastError;
};

const summarize = async (req, res) => {
    try {
        const { content } = req.body;
        if (!content) return res.status(400).json({ message: 'content is required' });

        const prompt = `Summarize the following study notes into 4-6 concise bullet points.
Keep each bullet short and high signal. Return plain text bullet points only.
Notes:
${normalizeContent(content)}`;

        const text = await generateWithFallback(prompt, 'summarize');
        return res.json({ summary: text });
    } catch (err) {
        console.error('[AI:summarize] Unhandled error:', err);
        return res.status(500).json({ message: 'AI summarize failed. Check server logs.' });
    }
};

const generateQuiz = async (req, res) => {
    try {
        const { content } = req.body;
        if (!content) return res.status(400).json({ message: 'content is required' });

        const prompt = `You are creating a quiz from study notes.
Generate exactly 5 multiple-choice questions based ONLY on the notes.
Return a JSON array with 5 objects:
[
  {"id":1,"question":"...","options":["A","B","C","D"],"correctAnswer":"..."}
]
Rules: 4 options, only one correct answer, ids must be 1-5, no extra text outside JSON.
Notes:
${normalizeContent(content)}`;

        const text = await generateWithFallback(prompt, 'quiz');
        const questions = parseJSONResponse(text);
        return res.json({ questions });
    } catch (err) {
        console.error('[AI:quiz] Unhandled error:', err);
        return res.status(500).json({ message: 'AI quiz generation failed. Check server logs.' });
    }
};

const saveScore = async (req, res) => {
    try {
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
    } catch (err) {
        console.error('[saveScore] Error:', err);
        return res.status(500).json({ message: 'Failed to save score.' });
    }
};

const generateTable = async (req, res) => {
    try {
        const { content } = req.body;
        if (!content) return res.status(400).json({ message: 'content is required' });

        const prompt = `Create a concise HTML table that summarizes the notes.
Rules:
- Return ONLY the <table>...</table> HTML (no markdown, no backticks, no extra text).
- Include class="sb-ai-table" on the <table>.
- Use 3 columns: Topic, Key Points, Example.
- Keep 3-6 rows.
Notes:
${normalizeContent(content)}`;

        const text = await generateWithFallback(prompt, 'table');
        return res.json({ table: text });
    } catch (err) {
        console.error('[AI:table] Unhandled error:', err);
        return res.status(500).json({ message: 'AI table generation failed. Check server logs.' });
    }
};

const rewrite = async (req, res) => {
    try {
        const { content, style = 'neutral' } = req.body;
        if (!content) return res.status(400).json({ message: 'content is required' });

        const prompt = `Rewrite the following notes in a ${style} writing style.
Keep the meaning intact. Preserve lists where possible. Return plain text.
Notes:
${normalizeContent(content)}`;

        const text = await generateWithFallback(prompt, 'rewrite');
        return res.json({ rewritten: text });
    } catch (err) {
        console.error('[AI:rewrite] Unhandled error:', err);
        return res.status(500).json({ message: 'AI rewrite failed. Check server logs.' });
    }
};

const chat = async (req, res) => {
    try {
        const { messages } = req.body;
        if (!Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({ message: 'messages array is required' });
        }

        const history = messages
            .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
            .join('\n');
        const prompt = `You are a helpful study assistant. Keep answers concise, clear, and relevant to students. Use markdown for simple formatting if needed (bold, lists).\n\nChat History:\n${history}\nAssistant:`;

        const text = await generateWithFallback(prompt, 'chat');
        return res.json({ reply: text });
    } catch (err) {
        console.error('[AI:chat] Unhandled error:', err);
        return res.status(500).json({ message: 'AI chat failed. Check server logs.' });
    }
};

const getScores = async (req, res) => {
    try {
        const scores = await QuizScore.find({ user: req.user._id }).sort({ createdAt: -1 });
        return res.json(scores);
    } catch (err) {
        console.error('[getScores] Error:', err);
        return res.status(500).json({ message: 'Failed to fetch scores.' });
    }
};

module.exports = { summarize, generateQuiz, generateTable, rewrite, chat, saveScore, getScores };
