export interface FieldError {
  field: string;
  message: string;
}

export abstract class AppError extends Error {
  abstract readonly statusCode: number;
  readonly errors?: FieldError[];

  constructor(message: string, errors?: FieldError[]) {
    super(message);
    this.name = this.constructor.name;
    this.errors = errors;
  }
}

export class ValidationError extends AppError {
  readonly statusCode = 400;
  constructor(message: string, errors?: FieldError[]) {
    super(message, errors);
  }
}

export class UnauthorizedError extends AppError {
  readonly statusCode = 401;
  constructor(message = "Credenciales inválidas o no autorizado") {
    super(message);
  }
}

export class ForbiddenError extends AppError {
  readonly statusCode = 403;
  constructor(message = "No tienes permisos suficientes para realizar esta acción") {
    super(message);
  }
}

export class NotFoundError extends AppError {
  readonly statusCode = 404;
  constructor(message = "Recurso no encontrado") {
    super(message);
  }
}

export class ConflictError extends AppError {
  readonly statusCode = 409;
  constructor(message: string, errors?: FieldError[]) {
    super(message, errors);
  }
}
