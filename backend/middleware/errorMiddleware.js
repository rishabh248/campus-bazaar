const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Resource not found with the provided ID';
  }

  // Add more specific error handling if needed (e.g., validation errors)
  // if (err.name === 'ValidationError') {
  //   statusCode = 400;
  //   message = Object.values(err.errors).map(val => val.message).join(', ');
  // }

  console.error(`ERROR: ${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack, // Hide stack in production
  });
};

module.exports = { notFound, errorHandler };
