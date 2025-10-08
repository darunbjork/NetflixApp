const express = require('express');
const { getMovies, getMovie } = require('../controllers/movies');

const router = express.Router();

router.route('/').get(getMovies);
router.route('/:id').get(getMovie);

module.exports = router;