const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please fill in all fields' });
    }

    const exists = await User.findOne({ email });
    if (exists) {
        return res.status(409).json({ message: 'Email already registered' });
    }

    const user = await User.create({ name, email, password });
    return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
    });
};

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please fill in all fields' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
    });
};

const getMe = async (req, res) => {
    const { _id, name, email, createdAt } = req.user;
    return res.json({ _id, name, email, createdAt });
};

module.exports = { register, login, getMe };
