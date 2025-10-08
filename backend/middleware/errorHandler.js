// Why Error Handling Middleware?
// Instead of manually writing res.status(404).json({...}) in every route, this centralized function catches errors thrown by Mongoose or custom logic. It checks the error type (CastError for bad IDs, ValidationError for missing fields) and sends the appropriate HTTP status code and a cleaner message to the client.

const errorHandler = (err, req, res, next) => {
  // Default to a 500 Server Error
  let error = { ...err };
  error.message = err.message;
  
  // Log the error (optional, helpful for debugging)
  console.error(err.stack);

  // Mongoose Bad ObjectId Error (e.g., GET /api/movies/12345)
  // This means the ID format is wrong (not a 24-char hex string)
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error = { statusCode: 404, message };
  }
  
  // Mongoose Validation Error (e.g., missing required fields on POST)
  if (err.name === 'ValidationError') {
    // We map over the errors object to get a list of messages
    const messages = Object.values(err.errors).map(val => val.message);
    const message = messages.join(', ');
    error = { statusCode: 400, message }; // 400 Bad Request
  }

  // Send the response
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error'
  });
};

module.exports = errorHandler;

