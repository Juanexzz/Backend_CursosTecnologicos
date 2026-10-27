import { Request, Response, NextFunction } from "express";
import { ITokenService } from "../../../domain/services/token-service.interface.js";
import { JwtTokenService } from "../../../infrastructure/security/jwt-token-service.js";

const defaultTokenService: ITokenService = new JwtTokenService();

export function createAuthMiddleware(tokenService: ITokenService = defaultTokenService) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({
        message: "No se proporcionó token de autenticación. Inicia sesión para continuar."
      });
      return;
    }

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0]?.toLowerCase() !== "bearer") {
      res.status(401).json({
        message: "Formato de token inválido. Debe ser 'Bearer <token>'."
      });
      return;
    }

    const token = parts[1];
    if (!token) {
      res.status(401).json({
        message: "Token ausente o no válido."
      });
      return;
    }

    try {
      const payload = tokenService.verifyToken(token);
      req.user = payload;
      next();
    } catch {
      res.status(401).json({
        message: "El token es inválido o ha expirado. Por favor inicia sesión nuevamente."
      });
    }
  };
}

export const authenticate = createAuthMiddleware();
export const authMiddleware = authenticate;
