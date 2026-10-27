import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppError } from "../../../domain/errors/domain-errors.js";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // 1. Errores de dominio (ValidationError, NotFoundError, ConflictError, etc.)
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      message: err.message,
      ...(err.errors && err.errors.length > 0 ? { errors: err.errors } : {}),
    });
    return;
  }

  // 2. Errores de validación de Zod (schemas de request)
  if (err instanceof ZodError) {
    const errors = err.errors.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));
    res.status(400).json({
      message: "Datos de la solicitud inválidos",
      errors,
    });
    return;
  }

  // 3. Error de sintaxis en JSON (body parser)
  if (err instanceof SyntaxError && "body" in err) {
    res.status(400).json({
      message: "Formato JSON inválido en el cuerpo de la petición.",
    });
    return;
  }

  // 4. Error genérico 500 — el stack y los detalles se registran en el servidor, NUNCA en la respuesta
  console.error("[ServerError]:", err instanceof Error ? err.stack : err);

  res.status(500).json({
    message: "Ocurrió un error interno en el servidor. Por favor intenta más tarde.",
  });
}

