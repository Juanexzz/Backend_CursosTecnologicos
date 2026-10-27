/**
 * Re-exporta los errores de dominio para mantener compatibilidad con imports existentes.
 * La fuente de verdad es domain/errors/domain-errors.ts
 */
export {
  AppError,
  FieldError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError
} from "../../domain/errors/domain-errors.js";
