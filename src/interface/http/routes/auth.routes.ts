import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { PrismaUserRepository } from "../../../infrastructure/repositories/prisma-user.repository.js";
import { BcryptPasswordHasher } from "../../../infrastructure/security/bcrypt-password-hasher.js";
import { JwtTokenService } from "../../../infrastructure/security/jwt-token-service.js";
import { RegisterUserUseCase } from "../../../application/use-cases/auth/register-user.use-case.js";
import { LoginUserUseCase } from "../../../application/use-cases/auth/login-user.use-case.js";
import { validate } from "../middlewares/validate.middleware.js";
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";

export function createAuthRouter(): Router {
  const router = Router();

  const userRepository = new PrismaUserRepository();
  const passwordHasher = new BcryptPasswordHasher();
  const tokenService = new JwtTokenService();

  const registerUseCase = new RegisterUserUseCase(userRepository, passwordHasher);
  const loginUseCase = new LoginUserUseCase(userRepository, passwordHasher, tokenService);

  const controller = new AuthController(registerUseCase, loginUseCase);

  router.post("/register", validate(registerSchema), controller.register);
  router.post("/login", validate(loginSchema), controller.login);

  return router;
}
