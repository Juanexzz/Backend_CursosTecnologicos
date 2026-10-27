import { Router } from "express";
import { InscripcionController } from "../controllers/inscripcion.controller.js";
import { inscripcionController as defaultController } from "../../../container.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { soloAdmin } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createInscripcionSchema, paginationQuerySchema } from "../schemas/inscripcion.schema.js";

export function createInscripcionRouter(controller: InscripcionController = defaultController): Router {
  const router = Router();

  // IMPORTANTE: /mias se declara antes que cualquier parámetro :id
  router.get(
    "/mias",
    authenticate,
    validate(paginationQuerySchema, "query"),
    controller.listMine
  );

  // Crear inscripción (usuario autenticado)
  router.post(
    "/",
    authenticate,
    validate(createInscripcionSchema),
    controller.create
  );

  // Listar todas las inscripciones (solo admin)
  router.get(
    "/",
    authenticate,
    soloAdmin,
    validate(paginationQuerySchema, "query"),
    controller.listAll
  );

  return router;
}
