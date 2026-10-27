import { UserRole } from "../entities/user.entity.js";

export interface TokenPayload {
  id: number;
  role: UserRole;
}

export interface ITokenService {
  generateToken(payload: TokenPayload): string;
  verifyToken(token: string): TokenPayload;
}
