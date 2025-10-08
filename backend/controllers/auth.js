const User = require('../models/User');
const asyncHandler = require('../middleware/async'); // Assuming you have an asyncHandler middleware
const ErrorResponse = require('../utils/errorResponse'); // Assuming you have an ErrorResponse utility

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    // Create user
    const user = await User.create({
      username,
      email,
      password,
    });

    return sendTokenResponse(user, 200, res);
  } catch (err) {
    // Mongo duplicate key ?
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0]; // 'username' or 'email'
      return next(new ErrorResponse(`${field} already exists`, 409));
    }
    // any other validation error
    return next(err);
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  // Check for user
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  sendTokenResponse(user, 200, res);
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
    });
};

// @desc    Log user out / clear cookie
// @route   GET /api/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000), // Expires in 10 seconds
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Add movie to favorites
// @route   PUT /api/auth/favorites/:movieId
// @access  Private
exports.addFavoriteMovie = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  if (!user.favoriteMovieIds.includes(req.params.movieId)) {
    user.favoriteMovieIds.push(req.params.movieId);
    await user.save();
  }

  res.status(200).json({
    success: true,
    data: user.favoriteMovieIds,
  });
});

// @desc    Remove movie from favorites
// @route   DELETE /api/auth/favorites/:movieId
// @access  Private
exports.removeFavoriteMovie = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  user.favoriteMovieIds = user.favoriteMovieIds.filter(
    (movieId) => movieId.toString() !== req.params.movieId
  );
  await user.save();

  res.status(200).json({
    success: true,
    data: user.favoriteMovieIds,
  });
});