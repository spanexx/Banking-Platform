class ApplicationError extends Error {
  constructor(message, statusCode = 500, errors = null) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

class BadRequestError extends ApplicationError {
  constructor(message = 'Bad Request', errors = null) {
    super(message, 400, errors);
  }
}

class UnauthorizedError extends ApplicationError {
  constructor(message = 'Unauthorized', errors = null) {
    super(message, 401, errors);
  }
}

class ForbiddenError extends ApplicationError {
  constructor(message = 'Forbidden', errors = null) {
    super(message, 403, errors);
  }
}

class NotFoundError extends ApplicationError {
  constructor(message = 'Resource not found', errors = null) {
    super(message, 404, errors);
  }
}

class ValidationError extends ApplicationError {
  constructor(message = 'Validation Error', errors = null) {
    super(message, 422, errors);
  }
}

class ConflictError extends ApplicationError {
  constructor(message = 'Conflict', errors = null) {
    super(message, 409, errors);
  }
}

class TooManyRequestsError extends ApplicationError {
  constructor(message = 'Too many requests', errors = null) {
    super(message, 429, errors);
  }
}

class InsufficientFundsError extends ApplicationError {
  constructor(message = 'Insufficient funds', errors = null) {
    super(message, 400, errors);
  }
}

module.exports = {
  ApplicationError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
  ConflictError,
  TooManyRequestsError,
  InsufficientFundsError
};
