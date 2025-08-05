const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // Send error response in a structured way
  res.status(statusCode).json({
    statusCode: statusCode,
    message: message, // Send the custom message
    success: false,
    data: null,
    errors: err.errors || [], // Any additional error details, if available
  });
};

export { errorHandler };
