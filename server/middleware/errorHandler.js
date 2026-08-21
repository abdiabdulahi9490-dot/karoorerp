// server/middleware/errorHandler.js
function errorHandler(err, req, res, next) {
  // Log error server-side, but do not leak stack traces to clients in production
  console.error(err);
  const message = process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message;
  res.status(err.status || 500).json({ message });
}

module.exports = { errorHandler };
