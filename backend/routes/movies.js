// backend/routes/movies.js
const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie'); // Import the Movie model

// Helper function to throw a custom 404 error
const notFound = (id) => {
    const error = new Error(`Movie not found with id of ${id}`);
    error.statusCode = 404;
    return error;
}

// @desc    Get all movies (or filter by genre)
// @route   GET /api/movies?genre=Action
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    let query = {};
    
    // Check for genre query parameter
    if (req.query.genre) {
        // Use a case-insensitive search within the 'genre' array
        query.genre = { $in: [new RegExp(req.query.genre, 'i')] }; 
    }
    
    const movies = await Movie.find(query).sort({ year: -1 });

    res.status(200).json({
      success: true,
      count: movies.length,
      data: movies,
    });
  } catch (error) {
    next(error); // Pass error to errorHandler middleware
  }
});

// @desc    Get single movie
// @route   GET /api/movies/:id
// @access  Public
router.get('/:id', async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      // Create and throw a 404 error if the ID format is correct but movie isn't found
      return next(notFound(req.params.id));
    }

    res.status(200).json({
      success: true,
      data: movie,
    });
  } catch (error) {
    next(error); // This will catch the CastError (bad ID format)
  }
});

// @desc    Create a movie
// @route   POST /api/movies
// @access  Admin (for now, public)
router.post('/', async (req, res, next) => {
  try {
    // req.body contains the JSON data thanks to express.json() middleware
    const movie = await Movie.create(req.body);

    // 201 Created status code
    res.status(201).json({
      success: true,
      data: movie,
    });
  } catch (error) {
    next(error); // This will catch the ValidationError (missing required fields)
  }
});

// @desc    Update a movie
// @route   PUT /api/movies/:id
// @access  Admin (for now, public)
router.put('/:id', async (req, res, next) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the updated document instead of the original
      runValidators: true, // Re-run the Mongoose schema validators on update
    });

    if (!movie) {
      return next(notFound(req.params.id));
    }

    res.status(200).json({
      success: true,
      data: movie,
    });
  } catch (error) {
    next(error); // Catches CastError or ValidationError
  }
});

// @desc    Delete a movie
// @route   DELETE /api/movies/:id
// @access  Admin (for now, public)
router.delete('/:id', async (req, res, next) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);

    if (!movie) {
      return next(notFound(req.params.id));
    }

    // 204 No Content status code (common for successful deletion)
    res.status(204).json({
      success: true,
      data: {}, // No content to return
    });
  } catch (error) {
    next(error); // Catches CastError
  }
});

module.exports = router;