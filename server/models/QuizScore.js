const mongoose = require('mongoose');

const quizScoreSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        score: { type: Number, required: true },
        total: { type: Number, required: true },
        subject: { type: String, default: 'Practice Quiz' },
        noteId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Note',
            default: null,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('QuizScore', quizScoreSchema);
