import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { authController as defaultController } from "../../../container.js";
import { validate } from "../middlewares/validate.middleware.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";

export function createAuthRouter(controller: AuthController = defaultController): Router {
  const router = Router();

  router.post("/register", validate(registerSchema), controller.register);
  router.post("/login", validate(loginSchema), controller.login);
  router.get("/me", authenticate, controller.me);

  return router;
}
