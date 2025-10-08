const Movie = require('../models/Movie');
const asyncHandler = require('../middleware/async');

// @desc    Get all movies
// @route   GET /api/movies
// @access  Public
exports.getMovies = asyncHandler(async (req, res, next) => {
  const movies = await Movie.find();

  res.status(200).json({
    success: true,
    count: movies.length,
    data: movies,
  });
});

// @desc    Get single movie
// @route   GET /api/movies/:id
// @access  Public
exports.getMovie = asyncHandler(async (req, res, next) => {
  const movie = await Movie.findById(req.params.id);

  if (!movie) {
    return next(new ErrorResponse(`Movie not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: movie,
  });
});