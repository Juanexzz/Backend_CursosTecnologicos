import jwt from "jsonwebtoken";
import { ITokenService, TokenPayload } from "../../domain/services/token-service.interface.js";
import { UserRole } from "../../domain/entities/user.entity.js";

export class JwtTokenService implements ITokenService {
  private getSecret(): string {
    const secret = process.env["JWT_SECRET"];
    if (!secret || secret.trim().length < 32) {
      throw new Error("JWT_SECRET no está configurado o tiene menos de 32 caracteres");
    }
    return secret;
  }

  private getExpiresIn(): string {
    return process.env["JWT_EXPIRES_IN"] ?? "24h";
  }

  generateToken(payload: TokenPayload): string {
    const secret = this.getSecret();
    const expiresIn = this.getExpiresIn();

    return jwt.sign(
      {
        id: payload.id,
        role: payload.role
      },
      secret,
      {
        algorithm: "HS256",
        expiresIn: expiresIn as jwt.SignOptions["expiresIn"]
      }
    );
  }

  verifyToken(token: string): TokenPayload {
    const secret = this.getSecret();
    const decoded = jwt.verify(token, secret, {
      algorithms: ["HS256"]
    }) as { id: number; role: UserRole };

    return {
      id: decoded.id,
      role: decoded.role
    };
  }
}
