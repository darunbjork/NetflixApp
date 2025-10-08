const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// @desc    Create a new message
// @route   POST /api/messages
// @access  Public
router.post('/', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        const newMessage = new Message({
            name,
            email,
            message,
        });

        const savedMessage = await newMessage.save();
        res.status(201).json({ success: true, data: savedMessage });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Serverfel' });
    }
});

module.exports = router;
