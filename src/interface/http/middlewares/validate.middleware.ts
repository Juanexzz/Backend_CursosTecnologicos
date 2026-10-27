import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { FieldError } from "../../../application/errors/application-errors.js";

type RequestSource = "body" | "query" | "params";

export function validate(schema: ZodSchema, source: RequestSource = "body") {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse(req[source]);
      req[source] = parsed;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: FieldError[] = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message
        }));

        res.status(400).json({
          message: "Error de validación en la solicitud",
          errors
        });
        return;
      }
      next(error);
    }
  };
}
