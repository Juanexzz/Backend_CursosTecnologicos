import { Router } from "express";
import { CursoController } from "../controllers/curso.controller.js";
import { cursoController as defaultController } from "../../../container.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { soloAdmin } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  cursoQuerySchema,
  cursoParamIdSchema,
  createCursoSchema,
  updateCursoSchema,
} from "../schemas/curso.schema.js";

export function createCursoRouter(controller: CursoController = defaultController): Router {
  const router = Router();

  // Rutas públicas
  router.get("/", validate(cursoQuerySchema, "query"), controller.list);
  router.get("/:id", validate(cursoParamIdSchema, "params"), controller.getById);

  // Rutas protegidas solo para administradores
  router.post("/", authMiddleware, soloAdmin, validate(createCursoSchema), controller.create);
  router.put(
    "/:id",
    authMiddleware,
    soloAdmin,
    validate(cursoParamIdSchema, "params"),
    validate(updateCursoSchema),
    controller.update
  );
  router.delete(
    "/:id",
    authMiddleware,
    soloAdmin,
    validate(cursoParamIdSchema, "params"),
    controller.delete
  );

  return router;
}
