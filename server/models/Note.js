const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
            maxlength: [200, 'Title cannot exceed 200 characters'],
        },
        content: {
            type: String,
            required: [true, 'Content is required'],
        },
        subject: {
            type: String,
            required: [true, 'Subject is required'],
            trim: true,
        },
        plainText: {
            type: String,
            default: '',
        },
        resources: {
            type: Array,
            default: [],
        },
    },
    { timestamps: true }
);

noteSchema.index({ user: 1, createdAt: -1 });
noteSchema.index({ user: 1, title: 'text', subject: 'text', plainText: 'text' });

module.exports = mongoose.model('Note', noteSchema);
