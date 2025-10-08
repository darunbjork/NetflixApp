const express = require('express');
const router = express.Router();
const { register, login, getMe, logout, addFavoriteMovie, removeFavoriteMovie } = require('../controllers/auth');

const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe); // Protected route to get current user
router.get('/logout', logout); // Add logout route

router.put('/favorites/:movieId', protect, addFavoriteMovie); // Add movie to favorites
router.delete('/favorites/:movieId', protect, removeFavoriteMovie); // Remove movie from favorites

module.exports = router;