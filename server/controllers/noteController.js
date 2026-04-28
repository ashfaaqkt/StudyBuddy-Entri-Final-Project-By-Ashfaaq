const Note = require('../models/Note');

const getNotes = async (req, res) => {
    const { search } = req.query;
    const filter = { user: req.user._id };

    if (search && search.trim()) {
        const keyword = search.trim();
        filter.$or = [
            { title: { $regex: keyword, $options: 'i' } },
            { subject: { $regex: keyword, $options: 'i' } },
            { plainText: { $regex: keyword, $options: 'i' } },
        ];
    }

    const notes = await Note.find(filter).sort({ createdAt: -1 });
    return res.json(notes);
};

const getNoteById = async (req, res) => {
    const note = await Note.findOne({ _id: req.params.id, user: req.user._id });
    if (!note) return res.status(404).json({ message: 'Note not found' });
    return res.json(note);
};

const createNote = async (req, res) => {
    const { title, content, subject, plainText, resources } = req.body;

    if (!title || !content || !subject) {
        return res.status(400).json({ message: 'Title, content and subject are required' });
    }

    const note = await Note.create({
        user: req.user._id,
        title,
        content,
        subject,
        plainText: plainText || '',
        resources: resources || [],
    });

    return res.status(201).json(note);
};

const updateNote = async (req, res) => {
    const note = await Note.findOne({ _id: req.params.id, user: req.user._id });
    if (!note) return res.status(404).json({ message: 'Note not found' });

    const { title, content, subject, plainText, resources } = req.body;
    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;
    if (subject !== undefined) note.subject = subject;
    if (plainText !== undefined) note.plainText = plainText;
    if (resources !== undefined) note.resources = resources;

    const updated = await note.save();
    return res.json(updated);
};

const deleteNote = async (req, res) => {
    const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!note) return res.status(404).json({ message: 'Note not found' });
    return res.json({ message: 'Note deleted' });
};

module.exports = { getNotes, getNoteById, createNote, updateNote, deleteNote };
