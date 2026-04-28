const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

const register = async (req, res) => {
    try {
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
    } catch (err) {
        console.error('[register]', err.message);
        return res.status(500).json({ message: 'Registration failed. Please try again.' });
    }
};

const login = async (req, res) => {
    try {
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
    } catch (err) {
        console.error('[login]', err.message);
        return res.status(500).json({ message: 'Login failed. Please try again.' });
    }
};

const getMe = async (req, res) => {
    try {
        const { _id, name, email, createdAt } = req.user;
        return res.json({ _id, name, email, createdAt });
    } catch (err) {
        console.error('[getMe]', err.message);
        return res.status(500).json({ message: 'Failed to fetch user.' });
    }
};

module.exports = { register, login, getMe };
