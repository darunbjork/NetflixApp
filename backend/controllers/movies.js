const Movie = require('../models/Movie');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse'); // Assuming this utility exists

// @desc    Get all movies
// @route   GET /api/movies
// @access  Public
exports.getMovies = asyncHandler(async (req, res, next) => {
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude from filtering (e.g., select, sort, page, limit)
  const removeFields = ['select', 'sort', 'page', 'limit'];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc.)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // Find movies
  query = Movie.find(JSON.parse(queryStr));

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt'); // Default sort by creation date descending
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Movie.countDocuments(JSON.parse(queryStr));

  query = query.skip(startIndex).limit(limit);

  const movies = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.status(200).json({
    success: true,
    count: movies.length,
    pagination,
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