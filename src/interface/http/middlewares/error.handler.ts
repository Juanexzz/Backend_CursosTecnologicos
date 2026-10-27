import { Request, Response, NextFunction } from "express";
import { AppError } from "../../../application/errors/application-errors.js";
import { Prisma } from "@prisma/client";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // 1. Errores controlados de la aplicación (Domain / Application)
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      message: err.message,
      ...(err.errors && err.errors.length > 0 ? { errors: err.errors } : {})
    });
    return;
  }

  // 2. Errores conocidos de Prisma
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      const target = Array.isArray(err.meta?.["target"])
        ? (err.meta?.["target"] as string[]).join(", ")
        : String(err.meta?.["target"] ?? "campo");

      res.status(409).json({
        message: "Ya existe un registro con estos datos únicos",
        errors: [{ field: target, message: `El valor proporcionado para ${target} ya está en uso.` }]
      });
      return;
    }

    if (err.code === "P2025") {
      res.status(404).json({
        message: "El recurso solicitado no fue encontrado o ya no existe."
      });
      return;
    }
  }

  // 3. Error de sintaxis en JSON (body parser)
  if (err instanceof SyntaxError && "body" in err) {
    res.status(400).json({
      message: "Formato JSON inválido en el cuerpo de la petición."
    });
    return;
  }

  // 4. Error genérico 500 sin exponer stack trace ni detalles internos
  console.error("[ServerError]:", err instanceof Error ? err.message : err);

  res.status(500).json({
    message: "Ocurrió un error interno en el servidor. Por favor intenta más tarde."
  });
}
