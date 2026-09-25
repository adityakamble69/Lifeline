// Centralized error handler.
// Never leak stack traces, DB errors, or internal details to the client.
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  console.error(`[error] ${req.method} ${req.originalUrl}`, err);

  const statusCode = err.statusCode && Number.isInteger(err.statusCode) ? err.statusCode : 500;
  const message = statusCode === 500 ? 'Internal server error' : err.message || 'Request failed';

  const body = {
    success: false,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message,
    },
  };

  if (err.details) body.error.details = err.details;

  res.status(statusCode).json(body);
}

export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.originalUrl} not found`,
    },
  });
}