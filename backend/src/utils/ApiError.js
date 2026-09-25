export class ApiError extends Error {
  constructor(statusCode, code, message, details) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    if (details) this.details = details;
    Error.captureStackTrace?.(this, ApiError);
  }

  static unauthorized(message = 'Authentication required.') {
    return new ApiError(401, 'UNAUTHORIZED', message);
  }

  static forbidden(message = 'You do not have permission to perform this action.') {
    return new ApiError(403, 'FORBIDDEN', message);
  }

  static notFound(message = 'Resource not found.') {
    return new ApiError(404, 'NOT_FOUND', message);
  }

  static conflict(message = 'Resource already exists.') {
    return new ApiError(409, 'CONFLICT', message);
  }

  static validation(message = 'Invalid request data.', details) {
    return new ApiError(400, 'VALIDATION_ERROR', message, details);
  }

  static internal(message = 'Internal server error.') {
    return new ApiError(500, 'INTERNAL_ERROR', message);
  }
}