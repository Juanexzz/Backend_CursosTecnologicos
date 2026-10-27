import { Request, Response, NextFunction } from "express";
import { UserRole } from "../../../domain/entities/user.entity.js";

export function requireRole(allowedRole: UserRole) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        message: "No autenticado. Se requiere iniciar sesión."
      });
      return;
    }

    if (req.user.role !== allowedRole) {
      res.status(403).json({
        message: "Acceso denegado: se requieren permisos de administrador para realizar esta acción."
      });
      return;
    }

    next();
  };
}

export const soloAdmin = requireRole("admin");
